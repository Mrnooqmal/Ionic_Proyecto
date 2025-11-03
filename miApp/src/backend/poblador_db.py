import mysql.connector
from faker import Faker
import random
from datetime import datetime, timedelta
import sys
from typing import List, Tuple, Dict, Any

# Configuración
TOTAL_PACIENTES = 2000
TOTAL_FAMILIAS = 500
DB_CONFIG = {
    'host': '34.233.199.164',
    'user': 'meditrack_user',
    'password': 'PasswordSeguro123!',
    'database': 'MediTrack'
}

fake = Faker('es_ES')

class MediTrackPopulator:
    def __init__(self, db_config):
        self.db_config = db_config
        self.connection = None
        self.cursor = None
        self.ids_cache = {}
        
    def connect(self):
        """Establecer conexión con la base de datos"""
        try:
            self.connection = mysql.connector.connect(**self.db_config)
            self.cursor = self.connection.cursor()
            print("✅ Conexión establecida con la base de datos")
        except mysql.connector.Error as err:
            print(f"❌ Error de conexión: {err}")
            sys.exit(1)
    
    def disconnect(self):
        """Cerrar conexión"""
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
        print("✅ Conexión cerrada")
    
    def check_existing_data(self, table_name):
        """Verificar si la tabla ya tiene datos"""
        try:
            self.cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = self.cursor.fetchone()[0]
            return count > 0
        except mysql.connector.Error as err:
            print(f"❌ Error al verificar datos en {table_name}: {err}")
            return False
    
    def get_max_id(self, table_name, id_column):
        """Obtener el máximo ID existente en una tabla"""
        try:
            self.cursor.execute(f"SELECT COALESCE(MAX({id_column}), 0) FROM {table_name}")
            return self.cursor.fetchone()[0]
        except mysql.connector.Error as err:
            print(f"❌ Error al obtener max ID de {table_name}: {err}")
            return 0
    
    def execute_batch(self, query, data, batch_size=500, table_name=""):
        """Ejecutar inserciones por lotes con manejo de errores"""
        if not data:
            print(f"  ⚠️  {table_name}: No hay datos para insertar")
            return 0
            
        total_inserted = 0
        for i in range(0, len(data), batch_size):
            batch = data[i:i + batch_size]
            try:
                self.cursor.executemany(query, batch)
                self.connection.commit()
                total_inserted += len(batch)
                if table_name and len(data) > batch_size:
                    print(f"  ↳ {table_name}: Insertados {total_inserted}/{len(data)} registros")
            except mysql.connector.Error as err:
                print(f"❌ Error en lote de {table_name}: {err}")
                # Intentar insertar uno por uno para identificar el problema
                successful = 0
                for record in batch:
                    try:
                        self.cursor.execute(query, record)
                        self.connection.commit()
                        successful += 1
                    except mysql.connector.Error as err2:
                        print(f"   ↳ Registro fallido: {record} - Error: {err2}")
                        self.connection.rollback()
                total_inserted += successful
                print(f"  ↳ {table_name}: Insertados {successful}/{len(batch)} registros en este lote")
        
        if table_name:
            print(f"✅ {table_name}: {total_inserted} registros insertados")
        return total_inserted
    
    def populate_tablas_base(self):
        """Poblar tablas base con datos predefinidos"""
        print("\n" + "="*50)
        print("POBLANDO TABLAS BASE")
        print("="*50)
        
        # Tabla: Alergia
        if not self.check_existing_data('Alergia'):
            alergias = [
                'Penicilina', 'Aspirina', 'Ibuprofeno', 'Sulfamidas', 'Codeína',
                'Morfina', 'Insulina', 'Vacunas', 'Mariscos', 'Maní', 'Lácteos',
                'Huevos', 'Gluten', 'Soja', 'Polen', 'Ácaros', 'Latex', 'Picadura de abeja',
                'Polvo doméstico', 'Hongos', 'Caspa de animales', 'Níquel', 'Perfumes'
            ]
            start_id = self.get_max_id('Alergia', 'idAlergia') + 1
            data_alergia = [(start_id + i, alergia) for i, alergia in enumerate(alergias)]  # SOLO 2 campos
            self.execute_batch(
                "INSERT INTO Alergia (idAlergia, alergia) VALUES (%s, %s)",  # SOLO 2 campos
                data_alergia, 
                table_name="Alergia"
            )
            self.ids_cache['alergias'] = [id for id, _ in data_alergia]
            
        # Tabla: Habito
        if not self.check_existing_data('Habito'):
            habitos = [
                'Fumador activo', 'Ex-fumador', 'Consumo alcohol ocasional',
                'Consumo alcohol frecuente', 'Sedentario', 'Activo', 'Deportista',
                'Dieta vegetariana', 'Dieta vegana', 'Dieta alta en proteínas',
                'Consumo drogas recreativas', 'Meditación regular', 'Yoga',
                'Ejercicio intenso', 'Ejercicio moderado', 'Consumo cafeína alto',
                'Trabajo nocturno', 'Estrés laboral alto', 'Sueño regular'
            ]
            start_id = self.get_max_id('Habito', 'idHabito') + 1
            data_habito = [(start_id + i, habito) for i, habito in enumerate(habitos)]  
            self.execute_batch(
                "INSERT INTO Habito (idHabito, habito) VALUES (%s, %s)",  
                data_habito, 
                table_name="Habito"
            )
            self.ids_cache['habitos'] = [id for id, _ in data_habito]
        
        # Tabla: Vacuna
        if not self.check_existing_data('Vacuna'):
            vacunas = [
                ('Influenza', 'Vacuna anual contra la gripe'),
                ('COVID-19', 'Vacuna contra COVID-19'),
                ('Hepatitis B', 'Vacuna contra hepatitis B'),
                ('Tétanos', 'Vacuna contra tétanos y difteria'),
                ('MMR', 'Sarampión, paperas y rubéola'),
                ('Varicela', 'Vacuna contra varicela'),
                ('HPV', 'Virus del papiloma humano'),
                ('Neumococo', 'Vacuna neumocócica conjugada'),
                ('Herpes Zóster', 'Vacuna contra culebrilla'),
                ('Fiebre amarilla', 'Vacuna para zonas endémicas'),
                ('Hepatitis A', 'Vacuna contra hepatitis A'),
                ('Triple viral', 'Sarampión, rubeola, paperas')
            ]
            start_id = self.get_max_id('Vacuna', 'idVacuna') + 1
            data_vacuna = [(start_id + i, nombre, obs) for i, (nombre, obs) in enumerate(vacunas)]
            self.execute_batch(
                "INSERT INTO Vacuna (idVacuna, nombre, observacion) VALUES (%s, %s, %s)", 
                data_vacuna, 
                table_name="Vacuna"
            )
            self.ids_cache['vacunas'] = [id for id, _, _ in data_vacuna]
        else:
            self.cursor.execute("SELECT idVacuna FROM Vacuna")
            self.ids_cache['vacunas'] = [row[0] for row in self.cursor.fetchall()]
            print(f"✅ Vacuna: Ya existen {len(self.ids_cache['vacunas'])} registros")
        
        # Tabla: Medicamento
        if not self.check_existing_data('Medicamento'):
            medicamentos = [
                ('Paracetamol', 'Bayer'),
                ('Ibuprofeno', 'Pfizer'),
                ('Amoxicilina', 'Roche'),
                ('Atorvastatina', 'Novartis'),
                ('Metformina', 'Merck'),
                ('Omeprazol', 'AstraZeneca'),
                ('Losartán', 'GSK'),
                ('Salbutamol', 'Sanofi'),
                ('Insulina Glargina', 'Lilly'),
                ('Levotiroxina', 'AbbVie'),
                ('Sertralina', 'Pfizer'),
                ('Amlodipino', 'Novartis')
            ]
            start_id = self.get_max_id('Medicamento', 'idMedicamento') + 1
            data_medicamento = [(start_id + i, nombre, empresa) for i, (nombre, empresa) in enumerate(medicamentos)]  # SOLO 3 campos
            self.execute_batch(
                "INSERT INTO Medicamento (idMedicamento, nombreMedicamento, empresa) VALUES (%s, %s, %s)",  # SOLO 3 campos
                data_medicamento, 
                table_name="Medicamento"
            )
            self.ids_cache['medicamentos'] = [id for id, _, _ in data_medicamento]
        
        # Tabla: TipoConsulta
        if not self.check_existing_data('TipoConsulta'):
            tipos_consulta = [
                'Consulta general', 'Control rutinario', 'Urgencia', 'Especialidad', 
                'Preventiva', 'Post-operatorio', 'Pediatría', 'Ginecología',
                'Cardiología', 'Dermatología', 'Traumatología'
            ]
            start_id = self.get_max_id('TipoConsulta', 'idTipoConsulta') + 1
            data_tipo_consulta = [(start_id + i, nombre) for i, nombre in enumerate(tipos_consulta)]
            self.execute_batch(
                "INSERT INTO TipoConsulta (idTipoConsulta, nombreTipoConsulta) VALUES (%s, %s)", 
                data_tipo_consulta, 
                table_name="TipoConsulta"
            )
            self.ids_cache['tipos_consulta'] = [id for id, _ in data_tipo_consulta]
        else:
            self.cursor.execute("SELECT idTipoConsulta FROM TipoConsulta")
            self.ids_cache['tipos_consulta'] = [row[0] for row in self.cursor.fetchall()]
        
        # Tabla: ServicioSalud
        if not self.check_existing_data('ServicioSalud'):
            servicios_salud = [
                ('Hospital Central', 'Av. Principal 123', 1),
                ('Clínica Norte', 'Calle Norte 456', 2),
                ('Centro de Salud Sur', 'Av. Sur 789', 3),
                ('Policlínico Este', 'Calle Este 321', 1),
                ('Hospital Regional', 'Av. Regional 654', 1),
                ('Clínica Privada Oeste', 'Av. Oeste 987', 2),
                ('Centro Médico Familiar', 'Calle Central 555', 3)
            ]
            start_id = self.get_max_id('ServicioSalud', 'idServicioSalud') + 1
            data_servicio_salud = [(start_id + i, nombre, direccion, tipo) for i, (nombre, direccion, tipo) in enumerate(servicios_salud)]
            self.execute_batch(
                "INSERT INTO ServicioSalud (idServicioSalud, nombreServicioSalud, direccion, idTipoServicioSalud) VALUES (%s, %s, %s, %s)", 
                data_servicio_salud, 
                table_name="ServicioSalud"
            )
            self.ids_cache['servicios_salud'] = [id for id, _, _, _ in data_servicio_salud]
        else:
            self.cursor.execute("SELECT idServicioSalud FROM ServicioSalud")
            self.ids_cache['servicios_salud'] = [row[0] for row in self.cursor.fetchall()]
        
        # Tabla: ProfesionalSalud
        if not self.check_existing_data('ProfesionalSalud'):
            especialidades = [
                'Medicina General', 'Cardiología', 'Pediatría', 'Ginecología', 
                'Traumatología', 'Dermatología', 'Oftalmología', 'Psiquiatría',
                'Neurología', 'Gastroenterología', 'Endocrinología', 'Urología'
            ]
            start_id = self.get_max_id('ProfesionalSalud', 'idProfesionalSalud') + 1
            data_profesional = []
            for i in range(100):
                data_profesional.append((
                    start_id + i,
                    fake.name(),
                    random.choice(especialidades)
                ))
            self.execute_batch(
                "INSERT INTO ProfesionalSalud (idProfesionalSalud, nombre, especialidad) VALUES (%s, %s, %s)",  # SOLO 3 campos
                data_profesional, 
                table_name="ProfesionalSalud"
            )
            self.ids_cache['profesionales'] = [id for id, _, _ in data_profesional]
        else:
            self.cursor.execute("SELECT idProfesionalSalud FROM ProfesionalSalud")
            self.ids_cache['profesionales'] = [row[0] for row in self.cursor.fetchall()]
        
        print("✅ Tablas base pobladas exitosamente")
    
    def populate_pacientes(self):
        """Poblar tabla Paciente"""
        print(f"\n📊 Poblando tabla Paciente...")
        
        if self.check_existing_data('Paciente') and len(self.ids_cache.get('pacientes', [])) >= TOTAL_PACIENTES:
            self.cursor.execute("SELECT idPaciente FROM Paciente")
            self.ids_cache['pacientes'] = [row[0] for row in self.cursor.fetchall()]
            print(f"✅ Paciente: Ya existen {len(self.ids_cache['pacientes'])} registros")
            return
        
        start_id_paciente = self.get_max_id('Paciente', 'idPaciente') + 1
        
        tipos_sangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        previsiones = ['FONASA', 'ISAPRE', 'Particular', 'Convenio']
        sexos = ['masculino', 'femenino']
        
        data_paciente = []
        
        for i in range(TOTAL_PACIENTES):
            fecha_nacimiento = fake.date_of_birth(minimum_age=1, maximum_age=95)
            edad = (datetime.now().date() - fecha_nacimiento).days // 365
            
            # Asignar sexo coherente con nombres
            sexo = random.choice(sexos)
            
            data_paciente.append((
                start_id_paciente + i,
                fake.name_male() if sexo == 'masculino' else fake.name_female(),
                fake.image_url() if random.random() < 0.3 else None,  # 30% tienen foto - CORREGIDO: fotoPerfil
                fecha_nacimiento,
                f"paciente{start_id_paciente + i}@{fake.domain_name()}",
                fake.phone_number()[:15],
                fake.address()[:100],
                sexo,
                fake.country()[:50],
                fake.job()[:50],
                random.choice(previsiones),
                random.choice(tipos_sangre)
            ))
        
        inserted = self.execute_batch(
            """INSERT INTO Paciente (idPaciente, nombrePaciente, fotoPerfil, fechaNacimiento, correo, telefono, 
            direccion, sexo, nacionalidad, ocupacion, prevision, tipoSangre) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            data_paciente,
            table_name="Paciente"
        )
        
        # Obtener todos los IDs de pacientes
        self.cursor.execute("SELECT idPaciente FROM Paciente")
        self.ids_cache['pacientes'] = [row[0] for row in self.cursor.fetchall()]
        print(f"✅ Paciente: {len(self.ids_cache['pacientes'])} registros totales")
    
    def populate_tablas_relacionales(self):
        """Poblar tablas relacionales de pacientes"""
        print("\n" + "="*50)
        print("POBLANDO TABLAS RELACIONALES")
        print("="*50)
        
        if not self.ids_cache.get('pacientes'):
            print("❌ No hay pacientes para crear relaciones")
            return
        
        # AlergiaPaciente
        print("📊 Poblando AlergiaPaciente...")
        data_alergia_paciente = []
        relaciones_existentes = set()

        # Verificar relaciones existentes
        try:
            self.cursor.execute("SELECT idPaciente, idAlergia FROM AlergiaPaciente")
            for row in self.cursor.fetchall():
                relaciones_existentes.add((row[0], row[1]))
        except:
            pass

        for paciente_id in random.sample(self.ids_cache['pacientes'], len(self.ids_cache['pacientes']) // 2):
            num_alergias = random.randint(0, 3)
            if num_alergias > 0:
                alergias_paciente = random.sample(self.ids_cache['alergias'], min(num_alergias, len(self.ids_cache['alergias'])))
                for alergia_id in alergias_paciente:
                    if (paciente_id, alergia_id) not in relaciones_existentes:
                        data_alergia_paciente.append((
                            paciente_id,
                            alergia_id,
                            fake.text(max_nb_chars=100),
                            fake.date_between(start_date='-5y', end_date='today')
                        ))
                        relaciones_existentes.add((paciente_id, alergia_id))
        
        self.execute_batch(
            "INSERT INTO AlergiaPaciente (idPaciente, idAlergia, observacion, fechaRegistro) VALUES (%s, %s, %s, %s)",
            data_alergia_paciente,
            table_name="AlergiaPaciente"
        )
        
        # HabitoPaciente
        print("📊 Poblando HabitoPaciente...")
        data_habito_paciente = []
        relaciones_existentes = set()

        # Verificar relaciones existentes
        try:
            self.cursor.execute("SELECT idPaciente, idHabito FROM HabitoPaciente")
            for row in self.cursor.fetchall():
                relaciones_existentes.add((row[0], row[1]))
        except:
            pass

        for paciente_id in random.sample(self.ids_cache['pacientes'], len(self.ids_cache['pacientes']) // 3):
            num_habitos = random.randint(1, 4)
            habitos_paciente = random.sample(self.ids_cache['habitos'], min(num_habitos, len(self.ids_cache['habitos'])))
            for habito_id in habitos_paciente:
                if (paciente_id, habito_id) not in relaciones_existentes:
                    data_habito_paciente.append((
                        paciente_id,
                        habito_id,
                        fake.text(max_nb_chars=100)
                    ))
                    relaciones_existentes.add((paciente_id, habito_id))

        self.execute_batch(
            "INSERT INTO HabitoPaciente (idPaciente, idHabito, observacion) VALUES (%s, %s, %s)",
            data_habito_paciente,
            table_name="HabitoPaciente"
        )
        
        # PacienteVacuna
        print("📊 Poblando PacienteVacuna...")
        data_paciente_vacuna = []
        relaciones_existentes = set()

        try:
            self.cursor.execute("SELECT idPaciente, idVacuna FROM PacienteVacuna")
            for row in self.cursor.fetchall():
                relaciones_existentes.add((row[0], row[1]))
        except:
            pass

        for paciente_id in random.sample(self.ids_cache['pacientes'], len(self.ids_cache['pacientes']) // 2):
            num_vacunas = random.randint(1, 5)
            vacunas_paciente = random.sample(self.ids_cache['vacunas'], min(num_vacunas, len(self.ids_cache['vacunas'])))
            for vacuna_id in vacunas_paciente:
                if (paciente_id, vacuna_id) not in relaciones_existentes:
                    data_paciente_vacuna.append((
                        paciente_id,
                        vacuna_id,
                        fake.date_between(start_date='-10y', end_date='today'),
                        f"Dosis {random.randint(1, 3)}",
                        fake.text(max_nb_chars=100)
                    ))
                    relaciones_existentes.add((paciente_id, vacuna_id))

        self.execute_batch(
            """INSERT INTO PacienteVacuna (idPaciente, idVacuna, fecha, dosis, observacion) 
            VALUES (%s, %s, %s, %s, %s)""",
            data_paciente_vacuna,
            table_name="PacienteVacuna"
        )
        
        # MedicamentoCronicoPaciente
        print("📊 Poblando MedicamentoCronicoPaciente...")
        data_medicamento_paciente = []
        relaciones_existentes = set()

        try:
            self.cursor.execute("SELECT idPaciente, idMedicamento FROM MedicamentoCronicoPaciente")
            for row in self.cursor.fetchall():
                relaciones_existentes.add((row[0], row[1]))
        except:
            pass

        for paciente_id in random.sample(self.ids_cache['pacientes'], len(self.ids_cache['pacientes']) // 4):
            num_medicamentos = random.randint(1, 3)
            medicamentos_paciente = random.sample(self.ids_cache['medicamentos'], min(num_medicamentos, len(self.ids_cache['medicamentos'])))
            for medicamento_id in medicamentos_paciente:
                if (paciente_id, medicamento_id) not in relaciones_existentes:
                    fecha_inicio = fake.date_between(start_date='-2y', end_date='today')
                    data_medicamento_paciente.append((
                        paciente_id,
                        medicamento_id,
                        fecha_inicio,
                        fake.date_between(start_date=fecha_inicio, end_date='today') if random.random() < 0.7 else None,
                        random.choice([0, 1])  # cronico
                    ))
                    relaciones_existentes.add((paciente_id, medicamento_id))

        self.execute_batch(
            """INSERT INTO MedicamentoCronicoPaciente (idPaciente, idMedicamento, fechaInicio, fechaFin, cronico) 
            VALUES (%s, %s, %s, %s, %s)""",
            data_medicamento_paciente,
            table_name="MedicamentoCronicoPaciente"
        )
        
        print("✅ Tablas relacionales pobladas exitosamente")
    
    def populate_familias(self):
        """Poblar tablas de familias"""
        print("\n" + "="*50)
        print("POBLANDO TABLAS DE FAMILIA")
        print("="*50)
        
        if not self.ids_cache.get('pacientes'):
            print("❌ No hay pacientes para crear familias")
            return
        
        # Obtener información de pacientes para crear familias coherentes
        self.cursor.execute("SELECT idPaciente, fechaNacimiento, sexo FROM Paciente")
        pacientes_info = {row[0]: {'fecha_nacimiento': row[1], 'sexo': row[2]} for row in self.cursor.fetchall()}
        
        # Tabla: Familia
        print("📊 Poblando Familia...")
        start_id_familia = self.get_max_id('Familia', 'idFamilia') + 1
        
        data_familia = []
        roles_familiares = ['Padre', 'Madre', 'Hijo', 'Hija', 'Hermano', 'Hermana', 'Abuelo', 'Abuela', 'Tutor', 'Otro']
        
        # Seleccionar pacientes adultos como dueños de familia
        pacientes_adultos = []
        for paciente_id, info in pacientes_info.items():
            edad = (datetime.now().date() - info['fecha_nacimiento']).days // 365
            if edad >= 18:
                pacientes_adultos.append(paciente_id)
        
        if not pacientes_adultos:
            print("❌ No hay pacientes adultos para crear familias")
            return
        
        familias_creadas = min(TOTAL_FAMILIAS, len(pacientes_adultos) // 2)
        dueños_familia = random.sample(pacientes_adultos, familias_creadas)
        
        for i, dueño_id in enumerate(dueños_familia):
            apellido_familia = fake.last_name()
            data_familia.append((
                start_id_familia + i,
                f"Familia {apellido_familia}",
                f"Grupo familiar de los {apellido_familia}. {fake.text(max_nb_chars=200)}",
                dueño_id
            ))
        
        inserted_familias = self.execute_batch(
            "INSERT INTO Familia (idFamilia, nombre, descripcion, idOwner) VALUES (%s, %s, %s, %s)",
            data_familia,
            table_name="Familia"
        )
        
        # Obtener IDs de familias creadas
        self.cursor.execute("SELECT idFamilia FROM Familia")
        self.ids_cache['familias'] = [row[0] for row in self.cursor.fetchall()]
        
        # Tabla: FamiliaPaciente
        print("📊 Poblando FamiliaPaciente...")
        data_familia_paciente = []
        
        for familia_id in self.ids_cache['familias']:
            # Obtener el dueño de esta familia
            self.cursor.execute("SELECT idOwner FROM Familia WHERE idFamilia = %s", (familia_id,))
            dueño_id = self.cursor.fetchone()[0]
            
            # El dueño siempre es miembro
            rol_dueño = 'Padre' if pacientes_info[dueño_id]['sexo'] == 'masculino' else 'Madre'
            data_familia_paciente.append((
                familia_id,
                dueño_id,
                fake.date_between(start_date='-5y', end_date='today'),
                rol_dueño
            ))
            
            # Agregar entre 1 y 5 miembros adicionales
            num_miembros_extra = random.randint(1, 5)
            miembros_posibles = [pid for pid in self.ids_cache['pacientes'] if pid != dueño_id]
            
            if miembros_posibles:
                miembros_extra = random.sample(miembros_posibles, min(num_miembros_extra, len(miembros_posibles)))
                
                for miembro_id in miembros_extra:
                    # Asignar rol coherente según edad y sexo
                    edad_miembro = (datetime.now().date() - pacientes_info[miembro_id]['fecha_nacimiento']).days // 365
                    sexo_miembro = pacientes_info[miembro_id]['sexo']
                    
                    if edad_miembro < 18:
                        rol = 'Hijo' if sexo_miembro == 'masculino' else 'Hija'
                    elif edad_miembro >= 60:
                        rol = 'Abuelo' if sexo_miembro == 'masculino' else 'Abuela'
                    else:
                        rol = random.choice(['Hermano', 'Hermana', 'Tutor', 'Otro'])
                    
                    data_familia_paciente.append((
                        familia_id,
                        miembro_id,
                        fake.date_between(start_date='-5y', end_date='today'),
                        rol
                    ))
        
        # Algunos pacientes pertenecen a múltiples familias (como hijos y cónyuges)
        print("📊 Creando membresías múltiples...")
        pacientes_en_familias = set()
        for familia_id, paciente_id, _, _ in data_familia_paciente:
            pacientes_en_familias.add(paciente_id)
        
        # Agregar segundas familias para algunos pacientes
        for _ in range(len(pacientes_en_familias) // 10):  # 10% tienen múltiples familias
            paciente_id = random.choice(list(pacientes_en_familias))
            familia_extra = random.choice(self.ids_cache['familias'])
            
            # Verificar que no sea ya miembro de esta familia
            if not any(fp[0] == familia_extra and fp[1] == paciente_id for fp in data_familia_paciente):
                data_familia_paciente.append((
                    familia_extra,
                    paciente_id,
                    fake.date_between(start_date='-2y', end_date='today'),
                    random.choice(roles_familiares)
                ))
        
        inserted_membresias = self.execute_batch(
            "INSERT INTO FamiliaPaciente (idFamilia, idPaciente, fechaAgregado, rol) VALUES (%s, %s, %s, %s)",
            data_familia_paciente,
            table_name="FamiliaPaciente"
        )
        
        print(f"✅ Familias: {inserted_familias} familias creadas")
        print(f"✅ FamiliaPaciente: {inserted_membresias} membresías creadas")
    
    def populate_consultas_y_diagnosticos(self):
        """Poblar consultas, diagnósticos y relacionados"""
        print("\n" + "="*50)
        print("POBLANDO CONSULTAS Y DIAGNÓSTICOS")
        print("="*50)
        
        if not all(k in self.ids_cache for k in ['pacientes', 'profesionales', 'tipos_consulta']):
            print("❌ Faltan datos base para crear consultas")
            return
        
        # Primero poblar Diagnostico si no existe
        if not self.check_existing_data('Diagnostico'):
            print("📊 Poblando Diagnostico...")
            diagnosticos = [
                (True, 'J06.9', 'Infección aguda de las vías respiratorias superiores'),
                (False, 'I10', 'Hipertensión esencial'),
                (True, 'R50.9', 'Fiebre de origen desconocido'),
                (False, 'E11.9', 'Diabetes mellitus tipo 2'),
                (True, 'S06.0', 'Conmoción cerebral'),
                (False, 'J45.9', 'Asma no alérgica'),
                (True, 'K29.7', 'Gastritis no especificada'),
                (False, 'M54.5', 'Lumbalgia baja'),
                (True, 'N39.0', 'Infección de tracto urinario'),
                (False, 'F41.9', 'Trastorno de ansiedad')
            ]
            start_id = self.get_max_id('Diagnostico', 'idDiagnostico') + 1
            data_diagnostico = [(start_id + i, urgencia, cie10, comentarios) for i, (urgencia, cie10, comentarios) in enumerate(diagnosticos)]
            self.execute_batch(
                "INSERT INTO Diagnostico (idDiagnostico, urgencia, cie10, comentarios) VALUES (%s, %s, %s, %s)", 
                data_diagnostico, 
                table_name="Diagnostico"
            )
            self.ids_cache['diagnosticos'] = [id for id, _, _, _ in data_diagnostico]
        else:
            self.cursor.execute("SELECT idDiagnostico FROM Diagnostico")
            self.ids_cache['diagnosticos'] = [row[0] for row in self.cursor.fetchall()]
        
        # Poblar Consulta
        print("📊 Poblando Consulta...")
        start_id_consulta = self.get_max_id('Consulta', 'idConsulta') + 1
        
        data_consulta = []
        num_consultas = min(len(self.ids_cache['pacientes']) * 2, 5000)  # Máximo 5000 consultas
        
        for i in range(num_consultas):
            fecha_ingreso = fake.date_between(start_date='-2y', end_date='today')
            data_consulta.append((
                start_id_consulta + i,
                random.choice(self.ids_cache['pacientes']),
                random.choice(self.ids_cache['servicios_salud']),  # idServicioSalud
                random.choice(self.ids_cache['profesionales']),    # idProfesionalSalud
                random.choice(self.ids_cache['tipos_consulta']),   # idTipoConsulta
                fecha_ingreso,
                fake.date_between(start_date=fecha_ingreso, end_date='today') if random.random() < 0.8 else None,
                random.choice(['Alta', 'Mejoría', 'Estable', 'Traslado', 'Fallecimiento']),
                fake.time(),
                fake.text(max_nb_chars=200),
                fake.text(max_nb_chars=200)
            ))
        
        inserted_consultas = self.execute_batch(
            """INSERT INTO Consulta (idConsulta, idPaciente, idServicioSalud, idProfesionalSalud, idTipoConsulta, 
            fechaIngreso, fechaEgreso, condicionEgreso, hora, motivo, observacion) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            data_consulta,
            table_name="Consulta"
        )
        
        # Obtener IDs de consultas creadas
        self.cursor.execute("SELECT idConsulta FROM Consulta")
        consultas_ids = [row[0] for row in self.cursor.fetchall()]
        
        # ConsultaDiagnostico
        print("📊 Poblando ConsultaDiagnostico...")
        data_consulta_diagnostico = []
        relaciones_existentes = set()
        
        try:
            self.cursor.execute("SELECT idConsulta, idDiagnostico FROM ConsultaDiagnostico")
            for row in self.cursor.fetchall():
                relaciones_existentes.add((row[0], row[1]))
        except:
            pass
        
        for consulta_id in consultas_ids:
            num_diagnosticos = random.randint(1, 2)
            diagnosticos_consulta = random.sample(self.ids_cache['diagnosticos'], min(num_diagnosticos, len(self.ids_cache['diagnosticos'])))
            for diagnostico_id in diagnosticos_consulta:
                if (consulta_id, diagnostico_id) not in relaciones_existentes:
                    data_consulta_diagnostico.append((
                        consulta_id,
                        diagnostico_id,
                        fake.text(max_nb_chars=200),
                        random.choice([True, False])
                    ))
                    relaciones_existentes.add((consulta_id, diagnostico_id))
        
        self.execute_batch(
            """INSERT INTO ConsultaDiagnostico (idConsulta, idDiagnostico, observacion, urgencia) 
            VALUES (%s, %s, %s, %s)""",
            data_consulta_diagnostico,
            table_name="ConsultaDiagnostico"
        )
        
        print(f"✅ Consultas: {inserted_consultas} consultas creadas")
        print(f"✅ Diagnósticos: {len(data_consulta_diagnostico)} relaciones creadas")
    
    def run(self):
        """Ejecutar todo el proceso de población"""
        try:
            self.connect()
            
            print("🚀 INICIANDO POBLACIÓN DE BASE DE DATOS MEDITRACK")
            print(f"🎯 Objetivo: {TOTAL_PACIENTES} pacientes, {TOTAL_FAMILIAS} familias")
            print("="*60)
            
            # Poblar en orden correcto considerando dependencias
            self.populate_tablas_base()
            self.populate_pacientes()
            self.populate_tablas_relacionales()
            self.populate_familias()
            self.populate_consultas_y_diagnosticos()
            
            # Estadísticas finales
            print("\n" + "="*60)
            print("📊 ESTADÍSTICAS FINALES")
            print("="*60)
            
            tables_to_check = [
                'Paciente', 'Alergia', 'Habito', 'Vacuna', 'Medicamento',
                'ProfesionalSalud', 'Familia', 'FamiliaPaciente', 'Consulta'
            ]
            
            for table in tables_to_check:
                try:
                    self.cursor.execute(f"SELECT COUNT(*) FROM {table}")
                    count = self.cursor.fetchone()[0]
                    print(f"  {table}: {count} registros")
                except mysql.connector.Error:
                    pass
            
            print("="*60)
            print("✅ POBLACIÓN COMPLETADA EXITOSAMENTE")
            print("="*60)
            
        except Exception as e:
            print(f"❌ Error durante la población: {e}")
            import traceback
            traceback.print_exc()
            if self.connection:
                self.connection.rollback()
        finally:
            self.disconnect()

if __name__ == "__main__":
    populator = MediTrackPopulator(DB_CONFIG)
    populator.run()