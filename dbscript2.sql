

-- auto-generated definition
create table "arbitrage".customer
(
  cust_id        uuid         not null,
  email                  varchar(100) not null,
  password               varchar(100) not null,

  first_name             varchar(100),
  last_name              varchar(100),
  company_name           varchar(100),
  mobile_number          varchar(20),
  country                varchar(5),

  is_email_verified      boolean,
  email_verified_on      timestamp(3),

  created_by             uuid,
  created_on             timestamp(3) with time zone,
  modified_on            timestamp(3) with time zone,
  modified_by            uuid ,

  CONSTRAINT cust_pkey PRIMARY KEY(cust_id),
  UNIQUE (email,mobile_number)

);



comment on column "arbitrage".customer.modified_on
is '
';


ALTER TABLE "arbitrage".customer
    OWNER to postgres;

