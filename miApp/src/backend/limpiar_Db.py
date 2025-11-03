import mysql.connector

DB_CONFIG = {
    'host': '34.233.199.164',
    'user': 'meditrack_user',
    'password': 'PasswordSeguro123!',
    'database': 'MediTrack'
}

def limpiar_base_datos():
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()
    
    print("⚠️  ADVERTENCIA: Esto eliminará TODOS los datos de la base de datos")
    confirmacion = input("¿Estás seguro? Escribe 'SI' para continuar: ")
    
    if confirmacion != 'SI':
        print("❌ Operación cancelada")
        return
    
    # Orden inverso por dependencias de claves foráneas
    tablas = [
        'ConsultaDiagnostico', 'Consulta',
        'FamiliaPaciente', 'Familia',
        'MedicamentoCronicoPaciente', 'PacienteVacuna', 
        'HabitoPaciente', 'AlergiaPaciente',
        'Paciente', 'Diagnostico', 'ProfesionalSalud', 
        'ServicioSalud', 'Medicamento', 'Vacuna', 
        'TipoConsulta', 'Habito', 'Alergia'
    ]
    
    try:
        # Desactivar verificación de claves foráneas temporalmente
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
        
        for tabla in tablas:
            cursor.execute(f"DELETE FROM {tabla}")
            print(f"✅ Tabla {tabla} limpiada - {cursor.rowcount} registros eliminados")
        
        # Resetear auto_increment
        tablas_auto_increment = ['Paciente', 'Consulta', 'Diagnostico', 'Familia']
        for tabla in tablas_auto_increment:
            cursor.execute(f"ALTER TABLE {tabla} AUTO_INCREMENT = 1")
            print(f"✅ Auto_increment de {tabla} reseteado")
        
        # Reactivar verificación de claves foráneas
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
        
        connection.commit()
        print("\n🎉 Base de datos limpiada completamente")
        
    except Exception as e:
        connection.rollback()
        print(f"❌ Error: {e}")
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    limpiar_base_datos()