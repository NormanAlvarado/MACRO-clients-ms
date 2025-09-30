#!/bin/bash

# Script para gestionar el stack de monitoreo MACRO Clients

COMPOSE_FILE="docker-compose.monitoring.yml"

case "$1" in
    "start")
        echo "🚀 Iniciando stack de monitoreo..."
        docker-compose -f $COMPOSE_FILE up -d --remove-orphans
        echo ""
        echo "✅ Servicios iniciados:"
        echo "   📊 Grafana: http://localhost:3001 (admin/admin)"
        echo "   🔍 Prometheus: http://localhost:9090"
        echo "   🐘 PostgreSQL: localhost:5433"
        echo ""
        echo "⏳ Esperando a que los servicios estén listos..."
        sleep 10
        docker-compose -f $COMPOSE_FILE ps
        ;;
    "stop")
        echo "🛑 Deteniendo stack de monitoreo..."
        docker-compose -f $COMPOSE_FILE down
        echo "✅ Stack detenido"
        ;;
    "restart")
        echo "🔄 Reiniciando stack de monitoreo..."
        docker-compose -f $COMPOSE_FILE restart
        echo "✅ Stack reiniciado"
        ;;
    "logs")
        echo "📋 Mostrando logs del stack..."
        docker-compose -f $COMPOSE_FILE logs -f
        ;;
    "status")
        echo "📊 Estado del stack de monitoreo:"
        docker-compose -f $COMPOSE_FILE ps
        ;;
    "clean")
        echo "🧹 Limpiando stack de monitoreo..."
        docker-compose -f $COMPOSE_FILE down -v --remove-orphans
        docker system prune -f
        docker network prune -f
        echo "✅ Limpieza completada"
        ;;
    *)
        echo "🔧 Uso: $0 {start|stop|restart|logs|status|clean}"
        echo ""
        echo "Comandos disponibles:"
        echo "  start   - Inicia todos los servicios"
        echo "  stop    - Detiene todos los servicios"  
        echo "  restart - Reinicia todos los servicios"
        echo "  logs    - Muestra logs en tiempo real"
        echo "  status  - Muestra el estado de los servicios"
        echo "  clean   - Detiene y limpia todos los volúmenes"
        exit 1
        ;;
esac