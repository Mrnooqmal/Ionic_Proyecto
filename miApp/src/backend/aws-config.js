/**
 * AWS Configuration para Textract
 * Las credenciales se cargan desde ~/.aws/credentials (sistema operativo)
 */

const AWS = require('aws-sdk');

// Configurar región
AWS.config.update({
  region: 'us-east-1' // Cambiar según tu región preferida
});

// Crear cliente Textract
const textract = new AWS.Textract({
  apiVersion: '2018-06-27'
});

/**
 * Analiza un documento con AWS Textract
 * @param {Buffer} documentBuffer - Buffer del archivo
 * @param {string} mimeType - Tipo MIME del archivo
 * @returns {Promise<Object>} Resultado del análisis
 */
async function analizarConTextract(documentBuffer, mimeType) {
  try {
    // Determinar tipo de documento
    let documentType = 'DOCUMENT';
    if (mimeType === 'application/pdf') {
      documentType = 'DOCUMENT';
    }

    const params = {
      Document: {
        Bytes: documentBuffer
      },
      ClientRequestToken: `exam-${Date.now()}`, // Token único para tracking
      JobTag: 'exam-analysis'
    };

    console.log('Iniciando análisis Textract...');
    const response = await textract.analyzeDocument(params).promise();

    // Procesar respuesta
    const resultado = {
      bloques: response.Blocks || [],
      confianza: calcularConfianzaPromedio(response.Blocks || []),
      texto: extraerTexto(response.Blocks || []),
      tablas: extraerTablas(response.Blocks || []),
      keyValuePairs: extraerKeyValuePairs(response.Blocks || []),
      timestamp: new Date().toISOString()
    };

    console.log('Análisis completado:', {
      confianza: resultado.confianza,
      bloques: resultado.bloques.length,
      tablas: resultado.tablas.length
    });

    return resultado;
  } catch (error) {
    console.error('Error en análisis Textract:', error);
    throw {
      code: 'TEXTRACT_ERROR',
      message: error.message,
      status: 500
    };
  }
}

/**
 * Calcula confianza promedio de detección
 */
function calcularConfianzaPromedio(bloques) {
  const confianzas = bloques
    .filter(b => b.Confidence !== undefined)
    .map(b => b.Confidence);

  if (confianzas.length === 0) return 0;
  return Math.round((confianzas.reduce((a, b) => a + b, 0) / confianzas.length) * 100) / 100;
}

/**
 * Extrae texto completo del documento
 */
function extraerTexto(bloques) {
  return bloques
    .filter(b => b.BlockType === 'LINE')
    .map(b => b.Text)
    .join('\n');
}

/**
 * Extrae tablas del documento
 */
function extraerTablas(bloques) {
  const tablas = [];
  const bloquesMap = {};

  // Crear mapa de bloques por ID
  bloques.forEach(b => {
    bloquesMap[b.Id] = b;
  });

  // Buscar tablas
  bloques
    .filter(b => b.BlockType === 'TABLE')
    .forEach(tabla => {
      const celdas = [];

      if (tabla.Relationships) {
        tabla.Relationships
          .filter(r => r.Type === 'CHILD')
          .forEach(rel => {
            rel.Ids.forEach(childId => {
              const bloque = bloquesMap[childId];
              if (bloque && bloque.BlockType === 'CELL') {
                celdas.push({
                  fila: bloque.RowIndex,
                  columna: bloque.ColumnIndex,
                  contenido: bloque.Text,
                  confianza: bloque.Confidence
                });
              }
            });
          });
      }

      if (celdas.length > 0) {
        tablas.push({ celdas, confianza: tabla.Confidence });
      }
    });

  return tablas;
}

/**
 * Extrae pares clave-valor (formularios, recibos, etc.)
 */
function extraerKeyValuePairs(bloques) {
  const pares = [];
  const bloquesMap = {};

  bloques.forEach(b => {
    bloquesMap[b.Id] = b;
  });

  bloques
    .filter(b => b.BlockType === 'KEY_VALUE_SET' && b.EntityTypes && b.EntityTypes.includes('KEY'))
    .forEach(keyBloque => {
      let textoKey = '';
      let textoValue = '';
      let confianzaKey = 0;
      let confianzaValue = 0;

      // Extraer texto de la KEY
      if (keyBloque.Relationships) {
        keyBloque.Relationships
          .filter(r => r.Type === 'CHILD')
          .forEach(rel => {
            rel.Ids.forEach(childId => {
              const bloque = bloquesMap[childId];
              if (bloque && bloque.BlockType === 'WORD') {
                textoKey += bloque.Text + ' ';
                confianzaKey = bloque.Confidence;
              }
            });
          });

        // Buscar VALUE asociado
        keyBloque.Relationships
          .filter(r => r.Type === 'VALUE')
          .forEach(rel => {
            rel.Ids.forEach(valueId => {
              const valueBloque = bloquesMap[valueId];
              if (valueBloque && valueBloque.BlockType === 'KEY_VALUE_SET') {
                if (valueBloque.Relationships) {
                  valueBloque.Relationships
                    .filter(r => r.Type === 'CHILD')
                    .forEach(rel => {
                      rel.Ids.forEach(childId => {
                        const bloque = bloquesMap[childId];
                        if (bloque && bloque.BlockType === 'WORD') {
                          textoValue += bloque.Text + ' ';
                          confianzaValue = bloque.Confidence;
                        }
                      });
                    });
                }
              }
            });
          });
      }

      if (textoKey.trim()) {
        pares.push({
          clave: textoKey.trim(),
          valor: textoValue.trim(),
          confianza: Math.min(confianzaKey, confianzaValue)
        });
      }
    });

  return pares;
}

module.exports = {
  analizarConTextract,
  calcularConfianzaPromedio,
  extraerTexto,
  extraerTablas,
  extraerKeyValuePairs
};
