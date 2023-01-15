--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3 (Debian 13.3-1.pgdg100+1)
-- Dumped by pg_dump version 13.3 (Debian 13.3-1.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;


--
-- Name: chalani_podlaha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chalani_podlaha (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.chalani_podlaha OWNER TO postgres;

--
-- Name: chalani_vzduch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chalani_vzduch (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.chalani_vzduch OWNER TO postgres;

--
-- Name: chodba_podlaha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chodba_podlaha (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.chodba_podlaha OWNER TO postgres;

--
-- Name: chodba_vzduch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chodba_vzduch (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.chodba_vzduch OWNER TO postgres;

--
-- Name: forecasts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forecasts (
    updated timestamp with time zone NOT NULL,
    lat numeric(8,6),
    lon numeric(8,6),
    "time" timestamp with time zone NOT NULL,
    air_pressure_at_sea_level numeric(6,1),
    air_temperature numeric(4,1),
    cloud_area_fraction numeric(4,1),
    cloud_area_fraction_high numeric(4,1),
    cloud_area_fraction_low numeric(4,1),
    cloud_area_fraction_medium numeric(4,1),
    dew_point_temperature numeric(4,1),
    fog_area_fraction numeric(4,1),
    relative_humidity numeric(3,0),
    ultraviolet_index_clear_sky numeric(2,0),
    wind_from_direction numeric(3,0),
    wind_speed numeric(4,1),
    precipitation_amount numeric(3,1)
);


ALTER TABLE public.forecasts OWNER TO postgres;

--
-- Name: kupelna_dole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kupelna_dole (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.kupelna_dole OWNER TO postgres;

--
-- Name: kupelna_hore; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kupelna_hore (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.kupelna_hore OWNER TO postgres;

--
-- Name: obyvacka_podlaha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.obyvacka_podlaha (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.obyvacka_podlaha OWNER TO postgres;

--
-- Name: obyvacka_vzduch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.obyvacka_vzduch (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.obyvacka_vzduch OWNER TO postgres;

--
-- Name: petra_podlaha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.petra_podlaha (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.petra_podlaha OWNER TO postgres;

--
-- Name: petra_vzduch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.petra_vzduch (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.petra_vzduch OWNER TO postgres;

--
-- Name: pracovna_podlaha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pracovna_podlaha (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.pracovna_podlaha OWNER TO postgres;

--
-- Name: pracovna_vzduch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pracovna_vzduch (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.pracovna_vzduch OWNER TO postgres;

--
-- Name: satna_podlaha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.satna_podlaha (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.satna_podlaha OWNER TO postgres;

--
-- Name: satna_vzduch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.satna_vzduch (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.satna_vzduch OWNER TO postgres;

--
-- Name: spalna_podlaha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spalna_podlaha (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.spalna_podlaha OWNER TO postgres;

--
-- Name: spalna_vzduch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spalna_vzduch (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.spalna_vzduch OWNER TO postgres;

--
-- Name: station_dctnotwv; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.station_dctnotwv (
    "timestamp" timestamp with time zone NOT NULL,
    tempin numeric(4,1),
    humidityin numeric(3,0),
    pressurerel numeric(6,1),
    pressureabs numeric(6,1),
    temp numeric(4,1),
    humidity numeric(3,0),
    winddir numeric(3,0),
    windspeed numeric(4,1),
    windgust numeric(4,1),
    rainrate numeric(5,1),
    solarradiation numeric(6,1),
    uv numeric(2,0),
    eventrain numeric(5,1),
    hourlyrain numeric(5,1),
    dailyrain numeric(5,1),
    weeklyrain numeric(5,1),
    monthlyrain numeric(5,1)
);


ALTER TABLE public.station_dctnotwv OWNER TO postgres;

--
-- Name: station_gjr6xkyg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.station_gjr6xkyg (
    "timestamp" timestamp with time zone NOT NULL,
    tempin numeric(4,1),
    humidityin numeric(3,0),
    pressurerel numeric(6,1),
    pressureabs numeric(6,1),
    temp numeric(4,1),
    humidity numeric(3,0),
    winddir numeric(3,0),
    windspeed numeric(4,1),
    windgust numeric(4,1),
    rainrate numeric(5,1),
    solarradiation numeric(6,1),
    uv numeric(2,0),
    eventrain numeric(5,1),
    hourlyrain numeric(5,1),
    dailyrain numeric(5,1),
    weeklyrain numeric(5,1),
    monthlyrain numeric(5,1)
);


ALTER TABLE public.station_gjr6xkyg OWNER TO postgres;

--
-- Name: tarif; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tarif (
    "timestamp" timestamp with time zone NOT NULL,
    tarif numeric(1,0)
);


ALTER TABLE public.tarif OWNER TO postgres;

--
-- Name: vonku; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vonku (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    humidity numeric(4,1),
    rain boolean
);


ALTER TABLE public.vonku OWNER TO postgres;

--
-- Name: zadverie_podlaha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zadverie_podlaha (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.zadverie_podlaha OWNER TO postgres;

--
-- Name: zadverie_vzduch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zadverie_vzduch (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    req numeric(3,0),
    reqall numeric(4,1),
    useroffset numeric(3,1),
    maxoffset numeric(3,1),
    kuri boolean,
    low boolean,
    leto boolean
);


ALTER TABLE public.zadverie_vzduch OWNER TO postgres;

--
-- Name: chalani_podlaha chalani_podlaha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chalani_podlaha
    ADD CONSTRAINT chalani_podlaha_pkey PRIMARY KEY ("timestamp");


--
-- Name: chalani_vzduch chalani_vzduch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chalani_vzduch
    ADD CONSTRAINT chalani_vzduch_pkey PRIMARY KEY ("timestamp");


--
-- Name: chodba_podlaha chodba_podlaha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chodba_podlaha
    ADD CONSTRAINT chodba_podlaha_pkey PRIMARY KEY ("timestamp");


--
-- Name: chodba_vzduch chodba_vzduch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chodba_vzduch
    ADD CONSTRAINT chodba_vzduch_pkey PRIMARY KEY ("timestamp");


--
-- Name: kupelna_dole kupelna_dole_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kupelna_dole
    ADD CONSTRAINT kupelna_dole_pkey PRIMARY KEY ("timestamp");


--
-- Name: kupelna_hore kupelna_hore_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kupelna_hore
    ADD CONSTRAINT kupelna_hore_pkey PRIMARY KEY ("timestamp");


--
-- Name: obyvacka_podlaha obyvacka_podlaha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.obyvacka_podlaha
    ADD CONSTRAINT obyvacka_podlaha_pkey PRIMARY KEY ("timestamp");


--
-- Name: obyvacka_vzduch obyvacka_vzduch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.obyvacka_vzduch
    ADD CONSTRAINT obyvacka_vzduch_pkey PRIMARY KEY ("timestamp");


--
-- Name: petra_podlaha petra_podlaha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.petra_podlaha
    ADD CONSTRAINT petra_podlaha_pkey PRIMARY KEY ("timestamp");


--
-- Name: petra_vzduch petra_vzduch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.petra_vzduch
    ADD CONSTRAINT petra_vzduch_pkey PRIMARY KEY ("timestamp");


--
-- Name: pracovna_podlaha pracovna_podlaha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pracovna_podlaha
    ADD CONSTRAINT pracovna_podlaha_pkey PRIMARY KEY ("timestamp");


--
-- Name: pracovna_vzduch pracovna_vzduch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pracovna_vzduch
    ADD CONSTRAINT pracovna_vzduch_pkey PRIMARY KEY ("timestamp");


--
-- Name: satna_podlaha satna_podlaha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.satna_podlaha
    ADD CONSTRAINT satna_podlaha_pkey PRIMARY KEY ("timestamp");


--
-- Name: satna_vzduch satna_vzduch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.satna_vzduch
    ADD CONSTRAINT satna_vzduch_pkey PRIMARY KEY ("timestamp");


--
-- Name: spalna_podlaha spalna_podlaha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spalna_podlaha
    ADD CONSTRAINT spalna_podlaha_pkey PRIMARY KEY ("timestamp");


--
-- Name: spalna_vzduch spalna_vzduch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spalna_vzduch
    ADD CONSTRAINT spalna_vzduch_pkey PRIMARY KEY ("timestamp");


--
-- Name: station_gjr6xkyg stanica_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_gjr6xkyg
    ADD CONSTRAINT stanica_pkey PRIMARY KEY ("timestamp");


--
-- Name: station_dctnotwv station_dctnotwv_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_dctnotwv
    ADD CONSTRAINT station_dctnotwv_pkey PRIMARY KEY ("timestamp");


--
-- Name: tarif tarif_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarif
    ADD CONSTRAINT tarif_pkey PRIMARY KEY ("timestamp");


--
-- Name: vonku vonku_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vonku
    ADD CONSTRAINT vonku_pkey PRIMARY KEY ("timestamp");


--
-- Name: zadverie_podlaha zadverie_podlaha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zadverie_podlaha
    ADD CONSTRAINT zadverie_podlaha_pkey PRIMARY KEY ("timestamp");


--
-- Name: zadverie_vzduch zadverie_vzduch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zadverie_vzduch
    ADD CONSTRAINT zadverie_vzduch_pkey PRIMARY KEY ("timestamp");


--
-- Name: forecasts forecasts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forecasts
    ADD CONSTRAINT forecasts_pkey PRIMARY KEY ("updated", "time", "lat", "lon");


--
-- PostgreSQL database dump complete
--
