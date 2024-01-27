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
-- Name: station_dom; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.station_dom (
    "timestamp" timestamp with time zone NOT NULL,
    temp numeric(4,1),
    humidity numeric(4,1),
    rain boolean,
    tarif numeric(1,0),
    living_room_air numeric(4,1),
    living_room_floor numeric(4,1),
    living_room_reqall numeric(4,1),
    living_room_heat boolean,
    living_room_off boolean,
    living_room_low boolean,
    guest_room_air numeric(4,1),
    guest_room_floor numeric(4,1),
    guest_room_reqall numeric(4,1),
    guest_room_heat boolean,
    guest_room_off boolean,
    guest_room_low boolean,
    bed_room_air numeric(4,1),
    bed_room_floor numeric(4,1),
    bed_room_reqall numeric(4,1),
    bed_room_heat boolean,
    bed_room_off boolean,
    bed_room_low boolean,
    boys_room_air numeric(4,1),
    boys_room_floor numeric(4,1),
    boys_room_reqall numeric(4,1),
    boys_room_heat boolean,
    boys_room_off boolean,
    boys_room_low boolean,
    petra_room_air numeric(4,1),
    petra_room_floor numeric(4,1),
    petra_room_reqall numeric(4,1),
    petra_room_heat boolean,
    petra_room_off boolean,
    petra_room_low boolean
);


ALTER TABLE public.station_dom OWNER TO postgres;


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
-- Name: station_gjr6xkyg stanica_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_gjr6xkyg
    ADD CONSTRAINT station_gjr6xkyg_pkey PRIMARY KEY ("timestamp");


--
-- Name: station_dctnotwv station_dctnotwv_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_dctnotwv
    ADD CONSTRAINT station_dctnotwv_pkey PRIMARY KEY ("timestamp");


--
-- Name: station_dom station_dom_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_dom
    ADD CONSTRAINT station_dom_pkey PRIMARY KEY ("timestamp");




--
-- Name: forecasts forecasts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forecasts
    ADD CONSTRAINT forecasts_pkey PRIMARY KEY ("updated", "time", "lat", "lon");


--
-- PostgreSQL database dump complete
--
