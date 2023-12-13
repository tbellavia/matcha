.PHONY: start
start:
	docker-compose up -d

.PHONY: stop
stop:
	docker-compose down

.PHONY: reload
reload:
	docker-compose up -d --force-recreate

.PHONY: rebuild
rebuild:
	docker-compose build

.PHONY: force-reload
force-reload:
	docker system prune -a
	docker-compose up -d

.PHONY: react-dev
react-dev:
	cd app ; npm run start:local

open-db:
	docker exec -it db psql -U matcha
