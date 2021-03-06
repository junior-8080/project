PGDMP
                         x            project #   11.7 (Ubuntu 11.7-0ubuntu0.19.10.1) #   11.7 (Ubuntu 11.7-0ubuntu0.19.10.1) -    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            �           1262    16433    project    DATABASE     y   CREATE DATABASE project WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';
    DROP DATABASE project;
             postgres    false            �            1259    16611    admin_table    TABLE     �   CREATE TABLE public.admin_table (
    admin_id integer NOT NULL,
    admin_email text NOT NULL,
    admin_password character varying(255) NOT NULL
);
    DROP TABLE public.admin_table;
       public         postgres    false            �            1259    16609    admin_table_admin_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admin_table_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.admin_table_admin_id_seq;
       public       postgres    false    203            �           0    0    admin_table_admin_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.admin_table_admin_id_seq OWNED BY public.admin_table.admin_id;
            public       postgres    false    202            �            1259    16568    category    TABLE     [   CREATE TABLE public.category (
    category_id integer NOT NULL,
    category_name text
);
    DROP TABLE public.category;
       public         postgres    false            �            1259    16566    category_category_id_seq    SEQUENCE     �   CREATE SEQUENCE public.category_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.category_category_id_seq;
       public       postgres    false    199            �           0    0    category_category_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.category_category_id_seq OWNED BY public.category.category_id;
            public       postgres    false    198            �            1259    16665    images    TABLE     �   CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,
    image_name character varying(100),
    image_path character varying(256)
);
    DROP TABLE public.images;
       public         postgres    false            �            1259    16663    images_image_id_seq    SEQUENCE     �   CREATE SEQUENCE public.images_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.images_image_id_seq;
       public       postgres    false    205            �           0    0    images_image_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.images_image_id_seq OWNED BY public.images.image_id;
            public       postgres    false    204            �            1259    33242    orders    TABLE     �   CREATE TABLE orders (
    order_id  SERIAL PRIMARY KEY,
    product_id integer references products(product_id),
    serial_number text,
    serial_time timestamp without time zone
);
    DROP TABLE public.orders;
       public         postgres    false            �            1259    33240    orders_order_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.orders_order_id_seq;
       public       postgres    false    209            �           0    0    orders_order_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;
            public       postgres    false    208            �            1259    24870 
   product_image    TABLE     m   CREATE TABLE product_image (
    id SERIAL PRIMARY KEY,
    product_id integer  references products(product_id),
    image_id integer  references images(image_id)
);
 !   DROP TABLE public.product_image;
       public         postgres    false            �            1259    24868    product_image_id_seq    SEQUENCE     �   CREATE SEQUENCE public.product_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.product_image_id_seq;
       public       postgres    false    207            �           0    0    product_image_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.product_image_id_seq OWNED BY public.product_image.id;
            public       postgres    false    206            �            1259    16590    products    TABLE     �  CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name text NOT NULL,
    brand text,
    product_price money NOT NULL,
    product_status text,
    category_name text NOT NULL,
    description text,
    user_id integer references users(user_id),
    cat_id integer,
    product_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    product_ordered character varying(5),
    orderd_data timestamp without time zone
);
    DROP TABLE public.products;
       public         postgres    false            �            1259    16588    products_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.products_product_id_seq;
       public       postgres    false    201            �           0    0    products_product_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;
            public       postgres    false    200            �            1259    16462    users    TABLE     $  CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_email character varying(255) NOT NULL,
    user_password character varying(255) NOT NULL,
    phonenumber character varying(16) NOT NULL,
    user_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    roles text
);
    DROP TABLE public.users;
       public         postgres    false            �            1259    16460    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public       postgres    false    197            �           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
            public       postgres    false    196            '           2604    16614    admin_table admin_id    DEFAULT     |   ALTER TABLE ONLY public.admin_table ALTER COLUMN admin_id SET DEFAULT nextval('public.admin_table_admin_id_seq'::regclass);
 C   ALTER TABLE public.admin_table ALTER COLUMN admin_id DROP DEFAULT;
       public       postgres    false    202    203    203            $           2604    16571    category category_id    DEFAULT     |   ALTER TABLE ONLY public.category ALTER COLUMN category_id SET DEFAULT nextval('public.category_category_id_seq'::regclass);
 C   ALTER TABLE public.category ALTER COLUMN category_id DROP DEFAULT;
       public       postgres    false    198    199    199            (           2604    16668    images image_id    DEFAULT     r   ALTER TABLE ONLY public.images ALTER COLUMN image_id SET DEFAULT nextval('public.images_image_id_seq'::regclass);
 >   ALTER TABLE public.images ALTER COLUMN image_id DROP DEFAULT;
       public       postgres    false    205    204    205            *           2604    33245    orders order_id    DEFAULT     r   ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);
 >   ALTER TABLE public.orders ALTER COLUMN order_id DROP DEFAULT;
       public       postgres    false    208    209    209            )           2604    24873    product_image id    DEFAULT     t   ALTER TABLE ONLY public.product_image ALTER COLUMN id SET DEFAULT nextval('public.product_image_id_seq'::regclass);
 ?   ALTER TABLE public.product_image ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    207    206    207            %           2604    16593    products product_id    DEFAULT     z   ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);
 B   ALTER TABLE public.products ALTER COLUMN product_id DROP DEFAULT;
       public       postgres    false    200    201    201            "           2604    16465 
   users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public       postgres    false    196    197    197            8           2606    16619    admin_table admin_table_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.admin_table
    ADD CONSTRAINT admin_table_pkey PRIMARY KEY (admin_id);
 F   ALTER TABLE ONLY public.admin_table DROP CONSTRAINT admin_table_pkey;
       public         postgres    false    203            4           2606    16576    category category_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (category_id);
 @   ALTER TABLE ONLY public.category DROP CONSTRAINT category_pkey;
       public         postgres    false    199            :           2606    16670    images images_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (image_id);
 <   ALTER TABLE ONLY public.images DROP CONSTRAINT images_pkey;
       public         postgres    false    205            <           2606    24875     product_image product_image_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.product_image
    ADD CONSTRAINT product_image_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.product_image DROP CONSTRAINT product_image_pkey;
       public         postgres    false    207            6           2606    16598    products products_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public         postgres    false    201            ,           2606    16476    users users_phonenumber_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phonenumber_key UNIQUE (phonenumber);
 E   ALTER TABLE ONLY public.users DROP CONSTRAINT users_phonenumber_key;
       public         postgres    false    197            .           2606    16470    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public         postgres    false    197            0           2606    16472    users users_user_email_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_email_key UNIQUE (user_email);
 D   ALTER TABLE ONLY public.users DROP CONSTRAINT users_user_email_key;
       public         postgres    false    197            2           2606    16474    users users_user_password_key 
   CONSTRAINT     a   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_password_key UNIQUE (user_password);
 G   ALTER TABLE ONLY public.users DROP CONSTRAINT users_user_password_key;
       public         postgres    false    197            @           2606    24881 )   product_image product_image_image_id_fkey 
   FK CONSTRAINT     �   ALTER TABLE ONLY public.product_image
    ADD CONSTRAINT product_image_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(image_id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.product_image DROP CONSTRAINT product_image_image_id_fkey;
       public       postgres    false    205    2874    207            ?           2606    24876 +   product_image product_image_product_id_fkey 
   FK CONSTRAINT     �   ALTER TABLE ONLY public.product_image
    ADD CONSTRAINT product_image_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.product_image DROP CONSTRAINT product_image_product_id_fkey;
       public       postgres    false    207    201    2870            >           2606    16604    products products_cat_id_fkey 
   FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_cat_id_fkey FOREIGN KEY (cat_id) REFERENCES public.category(category_id);
 G   ALTER TABLE ONLY public.products DROP CONSTRAINT products_cat_id_fkey;
       public       postgres    false    2868    201    199            =           2606    16599    products products_user_id_fkey 
   FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 H   ALTER TABLE ONLY public.products DROP CONSTRAINT products_user_id_fkey;
       public       postgres    false    2862    197    201           