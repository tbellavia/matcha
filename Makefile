.PHONY: start
start:
	docker-compose up -d

.PHONY: stop
stop:
	docker-compose down

.PHONY: reload
reload:
	docker-compose up -d --force-recreate