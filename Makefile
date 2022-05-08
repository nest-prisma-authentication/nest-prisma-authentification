start_containers:
	echo "Starting containers with docker compose..."
	docker-compose up -d
	sleep 5
	docker exec mongo /scripts/rs-init.sh
	echo "Containers started"
stop_containers:
	echo "Stoping containers with docker compose..."
	docker-compose down
	echo "Containers stoped"