<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'M9ny`*KsZ=|sd1}LJzku0L)6zC=(<#wSaTJncfrX-R2@k# 4&V7dzAX|hOc{C1S7' );
define( 'SECURE_AUTH_KEY',   'w)G=V||l5c4.Gb`3|;i{&I7mwyHY*8 sNP>dW$%lY*d2}-RJg@Avhnalh)ydkv,E' );
define( 'LOGGED_IN_KEY',     'qg07zCkHM/SE0yd ]|F|vcvf4v21b;y`>^Ip+GiEi[}t[Uj]LHm#0P_LlH+;q&-Z' );
define( 'NONCE_KEY',         'A#_Tt#dPidBN~jltK)ij)Sbo_HJ ?O7uQ8>H=|N>n;=ctp`}Vl]:zf{Ig.kqtl%)' );
define( 'AUTH_SALT',         'vBc[^|R2;jSV$HGH u65yU4P>0>k.IO+IGqc<@T4*t4<6n#utZ;9HG[ CH)I]_g,' );
define( 'SECURE_AUTH_SALT',  '${@kpU+ j}n|0?efGv!5v%/x6]^PUU33qPE~Q^eG_9%eW46C[8a*L*sQ$Q[%CYnT' );
define( 'LOGGED_IN_SALT',    '`Z~oU>_t.r^=U$$Zs0IgIw;M);FH>l,z=;f6 L<UAnh!0{mQtAv!)3K9G*NRxDZP' );
define( 'NONCE_SALT',        '+t{lTmsWz`S.B@0`2+}@)oE6CR8{jd^ey^/[+RLb$4|.&?pV%3bXgvIj*kv.Eo$X' );
define( 'WP_CACHE_KEY_SALT', 'K01=Z}r`S>S(ez[o;+I7rI0C!ap?R:eZjAz1d?/Vz_12%99l}|lOHfTE&-6,U&r|' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
