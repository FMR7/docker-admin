CREATE TABLE usuarios (
	username varchar(20) NOT NULL,
	"password" varchar(512) NOT NULL,
	active bool DEFAULT false NOT NULL,
	password_wrong_tries int4 DEFAULT 0 NOT NULL,
	"admin" bool DEFAULT false NOT NULL,
	CONSTRAINT usuarios_pk PRIMARY KEY (username)
);

CREATE TABLE log (
	log_key bigserial NOT NULL,
	username varchar(20) NOT NULL,
	"action" varchar NOT NULL,
	detail varchar NULL,
	log_date timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT log_pkey PRIMARY KEY (log_key),
	CONSTRAINT log_usuarios_fk FOREIGN KEY (username) REFERENCES usuarios(username) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE container_config (
	container_key varchar(256) NOT NULL,
	"name" varchar(50) NOT NULL,
	description varchar(256) NULL,
	active bool DEFAULT true NOT NULL,
	admin_only bool DEFAULT false NOT NULL,
	CONSTRAINT containers_pk PRIMARY KEY (container_key)
);