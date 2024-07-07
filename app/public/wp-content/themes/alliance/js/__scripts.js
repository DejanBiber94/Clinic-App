/* ATTENTION! This file was generated automatically! Don't change it!!!
----------------------------------------------------------------------- */
/**
 * Makes "skip to content" link work correctly in IE9, Chrome, and Opera
 * for better accessibility.
 *
 * @link http://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/
 */

( function() {
	"use strict";

	var ua = navigator.userAgent.toLowerCase();

	if ( ( ua.indexOf( 'webkit' ) > -1 || ua.indexOf( 'opera' ) > -1 || ua.indexOf( 'msie' ) > -1 ) &&
		document.getElementById && window.addEventListener ) {

		window.addEventListener( 'hashchange', function() {
			var element = document.getElementById( location.hash.substring( 1 ) );

			if ( element ) {
				if ( ! /^(?:a|select|input|button|textarea)$/i.test( element.nodeName ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
} )();
/**
 * Javascript utilities
 *
 * @package ALLIANCE
 * @since ALLIANCE 1.0
 */

/* global jQuery, ALLIANCE_STORAGE */

/* Global variables manipulations
---------------------------------------------------------------- */

(function(){
	"use strict";

	var $window   = jQuery( window ),
		$document = jQuery( document ),
		$adminbar = jQuery( '#wpadminbar' ),
		$body     = jQuery( 'body' );

	// Global variables storage
	if (typeof ALLIANCE_STORAGE == 'undefined') {
		window.ALLIANCE_STORAGE = {};
	}

	// Get global variable
	window.alliance_storage_get = function(var_name) {
		return alliance_isset( ALLIANCE_STORAGE[var_name] ) ? ALLIANCE_STORAGE[var_name] : '';
	};

	// Set global variable
	window.alliance_storage_set = function(var_name, value) {
		ALLIANCE_STORAGE[var_name] = value;
	};

	// Inc/Dec global variable with specified value
	window.alliance_storage_inc = function(var_name) {
		var value                  = arguments[1] === undefined ? 1 : arguments[1];
		ALLIANCE_STORAGE[var_name] += value;
	};

	// Concatenate global variable with specified value
	window.alliance_storage_concat = function(var_name, value) {
		ALLIANCE_STORAGE[var_name] += '' + value;
	};

	// Get global array element
	window.alliance_storage_get_array = function(var_name, key) {
		return alliance_isset( ALLIANCE_STORAGE[var_name][key] ) ? ALLIANCE_STORAGE[var_name][key] : '';
	};

	// Set global array element
	window.alliance_storage_set_array = function(var_name, key, value) {
		if ( ! alliance_isset( ALLIANCE_STORAGE[var_name] )) {
			ALLIANCE_STORAGE[var_name] = {};
		}
		ALLIANCE_STORAGE[var_name][key] = value;
	};

	// Inc/Dec global array element with specified value
	window.alliance_storage_inc_array = function(var_name, key) {
		var value                       = arguments[2] === undefined ? 1 : arguments[2];
		ALLIANCE_STORAGE[var_name][key] += value;
	};

	// Concatenate global array element with specified value
	window.alliance_storage_concat_array = function(var_name, key, value) {
		ALLIANCE_STORAGE[var_name][key] += '' + value;
	};

	/* PHP-style functions
	---------------------------------------------------------------- */
	window.alliance_isset = function(obj) {
		return typeof(obj) != 'undefined';
	};

	window.alliance_empty = function(obj) {
		return typeof(obj) == 'undefined' || (typeof(obj) == 'object' && obj === null) || (typeof(obj) == 'array' && obj.length === 0) || (typeof(obj) == 'string' && alliance_alltrim( obj ) === '') || obj === 0;
	};

	window.alliance_is_array = function(obj)  {
		return typeof(obj) == 'array';
	};

	window.alliance_is_object = function(obj)  {
		return typeof(obj) == 'object';
	};

	window.alliance_clone_object = function(obj) {
		if (obj === null || typeof(obj) != 'object') {
			return obj;
		}
		var temp = {};
		for (var key in obj) {
			temp[key] = alliance_clone_object( obj[key] );
		}
		return temp;
	};

	window.alliance_merge_objects = function(obj1, obj2)  {
		for (var i in obj2) {
			obj1[i] = obj2[i];
		}
		return obj1;
	};

	window.alliance_array_merge = function(a1, a2) {
		for (var i in a2) {
			a1[i] = a2[i];
		}
		return a1;
	};

	window.alliance_array_first_key = function(arr) {
		var rez = null;
		for (var i in arr) {
			rez = i;
			break;
		}
		return rez;
	};

	window.alliance_array_first_value = function(arr) {
		var rez = null;
		for (var i in arr) {
			rez = arr[i];
			break;
		}
		return rez;
	};

	// Generates a storable representation of a value
	window.alliance_serialize = function(mixed_val) {
		var obj_to_array = arguments.length == 1 || argument[1] === true;

		switch (typeof(mixed_val)) {

			case "number":
				if (isNaN( mixed_val ) || ! isFinite( mixed_val )) {
					return false;
				} else {
					return (Math.floor( mixed_val ) == mixed_val ? "i" : "d") + ":" + mixed_val + ";";
				}

			case "string":
				return "s:" + mixed_val.length + ":\"" + mixed_val + "\";";

			case "boolean":
				return "b:" + (mixed_val ? "1" : "0") + ";";

			case "object":
				if (mixed_val == null) {
					return "N;";
				} else if (mixed_val instanceof Array) {
					var idxobj = { idx: -1 };
					var map    = [];
					for (var i = 0; i < mixed_val.length; i++) {
						idxobj.idx++;
						var ser = alliance_serialize( mixed_val[i] );
						if (ser) {
							map.push( alliance_serialize( idxobj.idx ) + ser );
						}
					}
					return "a:" + mixed_val.length + ":{" + map.join( "" ) + "}";
				} else {
					var class_name = alliance_get_class( mixed_val );
					if (class_name == undefined) {
						return false;
					}
					var props = new Array();
					for (var prop in mixed_val) {
						var ser = alliance_serialize( mixed_val[prop] );
						if (ser) {
							props.push( alliance_serialize( prop ) + ser );
						}
					}
					if (obj_to_array) {
						return "a:" + props.length + ":{" + props.join( "" ) + "}";
					} else {
						return "O:" + class_name.length + ":\"" + class_name + "\":" + props.length + ":{" + props.join( "" ) + "}";
					}
				}

			case "undefined":
				return "N;";
		}
		return false;
	};

	// Encode / Decode Unicode string to / from single-byte characters
	( function( $ ) {
		var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
		a256 = '',
		r64 = [256],
		r256 = [256],
		i = 0;

		var UTF8 = {

			/**
			 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
			 * (BMP / basic multilingual plane only)
			 *
			 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
			 *
			 * @param {String} strUni Unicode string to be encoded as UTF-8
			 * @returns {String} encoded string
			 */
			encode: function(strUni) {
				// use regular expressions & String.replace callback function for better efficiency than procedural approaches
				var strUtf = strUni
								.replace(
									/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
									function(c) {
										var cc = c.charCodeAt(0);
										return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
									}
								)
								.replace(
									/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
									function(c) {
										var cc = c.charCodeAt(0);
										return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
									}
								);
				return strUtf;
			},

			/**
			* Decode utf-8 encoded string back into multi-byte Unicode characters
			*
			* @param {String} strUtf UTF-8 string to be decoded back to Unicode
			* @returns {String} decoded string
			*/
			decode: function(strUtf) {
				// note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
				var strUni = strUtf
								.replace(
									/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
									function(c) { // (note parentheses for precence)
										var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
										return String.fromCharCode(cc);
									}
								)
								.replace(
									/[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
									function(c) { // (note parentheses for precence)
										var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
										return String.fromCharCode(cc);
									}
								);
				return strUni;
			}
		};

		while( i < 256 ) {
			var c = String.fromCharCode(i);
			a256 += c;
			r256[i] = i;
			r64[i] = b64.indexOf(c);
			++i;
		}

		function code(s, discard, alpha, beta, w1, w2) {
			s = String(s);
			var buffer = 0,
				i = 0,
				length = s.length,
				result = '',
				bitsInBuffer = 0;

			while (i < length) {
				var c = s.charCodeAt(i);
				c = c < 256 ? alpha[c] : -1;

				buffer = (buffer << w1) + c;
				bitsInBuffer += w1;

				while (bitsInBuffer >= w2) {
					bitsInBuffer -= w2;
					var tmp = buffer >> bitsInBuffer;
					result += beta.charAt(tmp);
					buffer ^= tmp << bitsInBuffer;
				}
				++i;
			}
			if ( ! discard && bitsInBuffer > 0) {
				result += beta.charAt(buffer << (w2 - bitsInBuffer));
			}
			return result;
		}

		var Plugin = $.alliance_encoder = function(dir, input, encode) {
			return input ? Plugin[dir](input, encode) : dir ? null : this;
		};

		Plugin.btoa = Plugin.encode = function(plain, utf8encode) {
			plain = Plugin.raw === false || Plugin.utf8encode || utf8encode
						? UTF8.encode(plain)
						: plain;
			plain = code(plain, false, r256, b64, 8, 6);
			return plain + '===='.slice((plain.length % 4) || 4);
		};

		Plugin.atob = Plugin.decode = function(coded, utf8decode) {
			coded = String(coded).split('=');
			var i = coded.length;
			do {
				--i;
				coded[i] = code(coded[i], true, r64, a256, 6, 8);
			} while (i > 0);
			coded = coded.join('');
			return Plugin.raw === false || Plugin.utf8decode || utf8decode
					? UTF8.decode(coded)
					: coded;
		};
	}(jQuery) );

	// Returns the name of the class of an object
	window.alliance_get_class = function(obj) {
		if (obj instanceof Object && ! (obj instanceof Array) && ! (obj instanceof Function) && obj.constructor) {
			var arr = obj.constructor.toString().match( /function\s*(\w+)/ );
			if (arr && arr.length == 2) {
				return arr[1];
			}
		}
		return false;
	};


	/* Timing functions
	---------------------------------------------------------------- */
	window.alliance_debounce = function(func, wait) {
		var timeout;
		return function () {
			var context = this, args = arguments;
			var later = function later() {
				timeout = null;
				func.apply(context, args);
			};
			var callNow = !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) {
				func.apply(context, args);
			}
		};
	};

	window.alliance_throttle = function(func, wait, debounce) {
		var timeout;
		return function () {
			var context = this, args = arguments;
			var throttler = function () {
				timeout = null;
				func.apply(context, args);
			};
			if (debounce) clearTimeout(timeout);
			if (debounce || !timeout) timeout = setTimeout(throttler, wait);
		};
	};


	/* Mutation observers
	---------------------------------------------------------------- */
	var alliance_observers = {};

	// Create mutations observer
	window.alliance_create_observer = function( id, obj, callback, args ) {
		if ( typeof window.trx_addons_create_observer != 'undefined' ) {
			return trx_addons_create_observer( id, obj, callback, args );
		} else if ( typeof window.MutationObserver !== 'undefined' && obj.length > 0 ) {
			if ( typeof alliance_observers[ id ] == 'undefined' ) {
				var defa = {
						attributes: false,
						childList: true,
						subtree: true
					};
				if ( args ) {
					defa = alliance_object_merge( defa, args );
				}
				alliance_observers[ id ] = {
					observer: new MutationObserver( callback ),
					obj: obj.get(0)
				};
				alliance_observers[ id ].observer.observe( alliance_observers[ id ].obj, defa );
			}
			return true;
		}
		return false;
	};

	// Remove mutations observer
	window.alliance_remove_observer = function( id ) {
		if ( typeof window.trx_addons_remove_observer != 'undefined' ) {
			return trx_addons_remove_observer( id );
		} else if ( typeof window.MutationObserver !== 'undefined' ) {
			if ( typeof alliance_observers[ id ] !== 'undefined' ) {
				alliance_observers[ id ].observer.disconnect(
					alliance_observers[ id ].obj
				);
				delete alliance_observers[ id ];
			}
			return true;
		}
		return false;
	};


	/* Wordpress-style functions
	---------------------------------------------------------------- */

	var filters = {};

	// Add filter's handler
	window.alliance_add_filter = function( filter, callback, priority ) {
		if ( typeof window.trx_addons_add_filter != 'undefined' ) {
			trx_addons_add_filter( filter, callback, priority );
		} else if ( typeof wp != 'undefined' && typeof wp.hooks != 'undefined' ) {
			wp.hooks.addFilter( filter, 'alliance', callback, priority == undefined ? 10 : priority );
		} else {
			if ( ! filters[filter] ) filters[filter] = {};
			if ( ! filters[filter][priority] ) filters[filter][priority] = [];
			filters[filter][priority].push( callback );
		}
	};

	// Apply filter's handlers
	window.alliance_apply_filters = function( filter, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 ) {
		if ( typeof window.trx_addons_apply_filters != 'undefined' ) {
			arg1 = trx_addons_apply_filters( filter, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 );
		} else if ( typeof wp != 'undefined' && typeof wp.hooks != 'undefined' && typeof wp.hooks.applyFilters != 'undefined' ) {
			arg1 = wp.hooks.applyFilters( filter, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 );
		} else if ( typeof filters[filter] == 'object' ) {
			var keys = Object.keys(filters[filter]).sort();
			for (var i=0; i < keys.length; i++ ) {
				for (var j=0; j < filters[filter][keys[i]].length; j++ ) {
					if ( typeof filters[filter][keys[i]][j] == 'function' ) {
						arg1 = filters[filter][keys[i]][j](arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
					}
				}
			}
		}
		return arg1;
	};

	// Add action's handler
	window.alliance_add_action = function( action, callback, priority ) {
		if ( typeof window.trx_addons_add_action != 'undefined' ) {
			trx_addons_add_action( action, callback, priority );
		} else if ( typeof wp != 'undefined' && typeof wp.hooks != 'undefined' ) {
			wp.hooks.addAction( action, 'alliance', callback, priority == undefined ? 10 : priority );
		} else {
			alliance_add_filter( action, callback, priority );
		}
	};

	// Do action's handlers
	window.alliance_do_action = function( action, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 ) {
		if ( typeof window.trx_addons_do_action != 'undefined' ) {
			trx_addons_do_action( action, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 );
		} else if ( typeof wp != 'undefined' && typeof wp.hooks != 'undefined' && typeof wp.hooks.doActions != 'undefined' ) {
			wp.hooks.doActions( action, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 );
		} else {
			alliance_apply_filters( action, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 );
		}
	};


	/* String functions
	---------------------------------------------------------------- */

	window.alliance_in_list = function(str, list) {
		var delim  = arguments[2] !== undefined ? arguments[2] : '|';
		var icase  = arguments[3] !== undefined ? arguments[3] : true;
		var retval = false;
		if (icase) {
			if (typeof(str) == 'string') {
				str = str.toLowerCase();
			}
			list = list.toLowerCase();
		}
		var parts = list.split( delim );
		for (var i = 0; i < parts.length; i++) {
			if (parts[i] == str) {
				retval = true;
				break;
			}
		}
		return retval;
	};

	window.alliance_alltrim = function(str) {
		var dir      = arguments[1] !== undefined ? arguments[1] : 'a';
		var rez      = '';
		var i, start = 0, end = str.length - 1;
		if (dir == 'a' || dir == 'l') {
			for (i = 0; i < str.length; i++) {
				if (str.substr( i, 1 ) != ' ') {
					start = i;
					break;
				}
			}
		}
		if (dir == 'a' || dir == 'r') {
			for (i = str.length - 1; i >= 0; i--) {
				if (str.substr( i, 1 ) != ' ') {
					end = i;
					break;
				}
			}
		}
		return str.substring( start, end + 1 );
	};

	window.alliance_ltrim = function(str) {
		return alliance_alltrim( str, 'l' );
	};

	window.alliance_rtrim = function(str) {
		return alliance_alltrim( str, 'r' );
	};

	window.alliance_padl = function(str, len) {
		var ch  = arguments[2] !== undefined ? arguments[2] : ' ';
		var rez = str.substr( 0, len );
		if (rez.length < len) {
			for (var i = 0; i < len - str.length; i++) {
				rez += ch;
			}
		}
		return rez;
	};

	window.alliance_padr = function(str, len) {
		var ch  = arguments[2] !== undefined ? arguments[2] : ' ';
		var rez = str.substr( 0, len );
		if (rez.length < len) {
			for (var i = 0; i < len - str.length; i++) {
				rez = ch + rez;
			}
		}
		return rez;
	};

	window.alliance_padc = function(str, len) {
		var ch  = arguments[2] !== undefined ? arguments[2] : ' ';
		var rez = str.substr( 0, len );
		if (rez.length < len) {
			for (var i = 0; i < Math.floor( (len - str.length) / 2 ); i++) {
				rez = ch + rez + ch;
			}
		}
		return rez + (rez.length < len ? ch : '');
	};

	window.alliance_replicate = function(str, num) {
		var rez = '';
		for (var i = 0; i < num; i++) {
			rez += str;
		}
		return rez;
	};

	window.alliance_prepare_macros = function(str) {
		return str
			.replace( /\{\{/g, "<i>" )
			.replace( /\}\}/g, "</i>" )
			.replace( /\(\(/g, "<b>" )
			.replace( /\)\)/g, "</b>" )
			.replace( /\|\|/g, "<br>" );
	};


	/* Numbers functions
	---------------------------------------------------------------- */

	// Round number to specified precision.
	// For example: num=1.12345, prec=2,  rounded=1.12
	//              num=12345,   prec=-2, rounded=12300
	window.alliance_round_number = function(num) {
		var precision = arguments[1] !== undefined ? arguments[1] : 0;
		var p         = Math.pow( 10, precision );
		return Math.round( num * p ) / p;
	};

	// Clear number from any characters and append it with 0 to desired precision
	// For example: num=test1.12dd, prec=3, cleared=1.120
	window.alliance_clear_number = function(num) {
		var precision = arguments[1] !== undefined ? arguments[1] : 0;
		var defa      = arguments[2] !== undefined ? arguments[2] : 0;
		var res       = '';
		var decimals  = -1;
		num           = "" + num;
		if (num == "") {
			num = "" + defa;
		}
		for (var i = 0; i < num.length; i++) {
			if (decimals == 0) {
				break;
			} else if (decimals > 0) {
				decimals--;
			}
			var ch = num.substr( i,1 );
			if (ch == '.') {
				if (precision > 0) {
					res += ch;
				}
				decimals = precision;
			} else if ((ch >= 0 && ch <= 9) || (ch == '-' && i == 0)) {
				res += ch;
			}
		}
		if (precision > 0 && decimals != 0) {
			if (decimals == -1) {
				res     += '.';
				decimals = precision;
			}
			for (i = decimals; i > 0; i--) {
				res += '0';
			}
		}
		//if (isNaN(res)) res = clearNumber(defa, precision, defa);
		return res;
	};

	// Convert number from decimal to hex
	window.alliance_dec2hex = function(n) {
		return Number( n ).toString( 16 );
	};

	// Convert number from hex to decimal
	window.alliance_hex2dec = function(hex) {
		return parseInt( hex,16 );
	};


	/* Array manipulations
	---------------------------------------------------------------- */

	window.alliance_in_array = function(val, thearray)  {
		var rez = false;
		for (var i = 0; i < thearray.length - 1; i++) {
			if (thearray[i] == val) {
				rez = true;
				break;
			}
		}
		return rez;
	};

	window.alliance_sort_array = function(thearray)  {
		var caseSensitive = arguments[1] !== undefined ? arguments[1] : false;
		var tmp           = '';
		for (var x = 0; x < thearray.length - 1; x++) {
			for (var y = (x + 1); y < thearray.length; y++) {
				if (caseSensitive) {
					if (thearray[x] > thearray[y]) {
						tmp         = thearray[x];
						thearray[x] = thearray[y];
						thearray[y] = tmp;
					}
				} else {
					if (thearray[x].toLowerCase() > thearray[y].toLowerCase()) {
						tmp         = thearray[x];
						thearray[x] = thearray[y];
						thearray[y] = tmp;
					}
				}
			}
		}
		return thearray;
	};

	/* Date manipulations
	---------------------------------------------------------------- */

	// Return array[Year, Month, Day, Hours, Minutes, Seconds]
	// from string: Year[-/.]Month[-/.]Day[T ]Hours:Minutes:Seconds
	window.alliance_parse_date = function(dt) {
		dt      = dt.replace( /\//g, '-' ).replace( /\./g, '-' ).replace( /T/g, ' ' ).split( '+' )[0];
		var dt2 = dt.split( ' ' );
		var d   = dt2[0].split( '-' );
		var t   = dt2[1].split( ':' );
		d.push( t[0], t[1], t[2] );
		return d;
	};

	// Return difference string between two dates
	window.alliance_get_date_difference = function(dt1) {
		var dt2        = arguments[1] !== undefined ? arguments[1] : '';
		var short_date = arguments[2] !== undefined ? arguments[2] : true;
		var sec        = arguments[3] !== undefined ? arguments[3] : false;
		var a1         = alliance_parse_date( dt1 );
		dt1            = Date.UTC( a1[0], a1[1], a1[2], a1[3], a1[4], a1[5] );
		if (dt2 == '') {
			dt2    = new Date();
			var a2 = [dt2.getFullYear(), dt2.getMonth() + 1, dt2.getDate(), dt2.getHours(), dt2.getMinutes(), dt2.getSeconds()];
		} else {
			var a2 = alliance_parse_date( dt2 );
		}
		dt2         = Date.UTC( a2[0], a2[1], a2[2], a2[3], a2[4], a2[5] );
		var diff    = Math.round( (dt2 - dt1) / 1000 );
		var days    = Math.floor( diff / (24 * 3600) );
		diff       -= days * 24 * 3600;
		var hours   = Math.floor( diff / 3600 );
		diff       -= hours * 3600;
		var minutes = Math.floor( diff / 60 );
		diff       -= minutes * 60;
		var rez     = '';
		if (days > 0) {
			rez += (rez !== '' ? ' ' : '') + days + ' day' + (days > 1 ? 's' : '');
		}
		if (( ! short_date || rez == '') && hours > 0) {
			rez += (rez !== '' ? ' ' : '') + hours + ' hour' + (hours > 1 ? 's' : '');
		}
		if (( ! short_date || rez == '') && minutes > 0) {
			rez += (rez !== '' ? ' ' : '') + minutes + ' minute' + (minutes > 1 ? 's' : '');
		}
		if (sec || rez == '') {
			rez += rez !== '' || sec ? (' ' + diff + ' second' + (diff > 1 ? 's' : '')) : 'less then minute';
		}
		return rez;
	};

	/* Colors functions
	---------------------------------------------------------------- */

	window.alliance_hex2rgb = function(hex) {
		hex = parseInt( ((hex.indexOf( '#' ) > -1) ? hex.substring( 1 ) : hex), 16 );
		return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
	};

	window.alliance_hex2rgba = function(hex, alpha) {
		var rgb = alliance_hex2rgb( hex );
		return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
	};

	window.alliance_rgb2hex = function(color) {
		var aRGB;
		color = color.replace( /\s/g,"" ).toLowerCase();
		if (color == 'rgba(0,0,0,0)' || color == 'rgba(0%,0%,0%,0%)') {
			color = 'transparent';
		}
		if (color.indexOf( 'rgba(' ) == 0) {
			aRGB = color.match( /^rgba\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i );
		} else {
			aRGB = color.match( /^rgb\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i );
		}

		if (aRGB) {
			color = '';
			for (var i = 1; i <= 3; i++) {
				color += Math.round( (aRGB[i][aRGB[i].length - 1] == "%" ? 2.55 : 1) * parseInt( aRGB[i] ) ).toString( 16 ).replace( /^(.)$/,'0$1' );
			}
		} else {
			color = color.replace( /^#?([\da-f])([\da-f])([\da-f])$/i, '$1$1$2$2$3$3' );
		}
		return (color.substr( 0,1 ) != '#' ? '#' : '') + color;
	};

	window.alliance_components2hex = function(r,g,b) {
		return '#' +
			Number( r ).toString( 16 ).toUpperCase().replace( /^(.)$/,'0$1' ) +
			Number( g ).toString( 16 ).toUpperCase().replace( /^(.)$/,'0$1' ) +
			Number( b ).toString( 16 ).toUpperCase().replace( /^(.)$/,'0$1' );
	};

	window.alliance_rgb2components = function(color) {
		color       = alliance_rgb2hex( color );
		var matches = color.match( /^#?([\dabcdef]{2})([\dabcdef]{2})([\dabcdef]{2})$/i );
		if ( ! matches) {
			return false;
		}
		for (var i = 1, rgb = new Array( 3 ); i <= 3; i++) {
			rgb[i - 1] = parseInt( matches[i],16 );
		}
		return rgb;
	};

	window.alliance_hex2hsb = function(hex) {
		var h   = arguments[1] !== undefined ? arguments[1] : 0;
		var s   = arguments[2] !== undefined ? arguments[2] : 0;
		var b   = arguments[3] !== undefined ? arguments[3] : 0;
		var hsb = alliance_rgb2hsb( alliance_hex2rgb( hex ) );
		hsb.h   = Math.min( 359, Math.max( 0, hsb.h + h ) );
		hsb.s   = Math.min( 100, Math.max( 0, hsb.s + s ) );
		hsb.b   = Math.min( 100, Math.max( 0, hsb.b + b ) );
		return hsb;
	};

	window.alliance_hsb2hex = function(hsb) {
		var rgb = alliance_hsb2rgb( hsb );
		return alliance_components2hex( rgb.r, rgb.g, rgb.b );
	};

	window.alliance_rgb2hsb = function(rgb) {
		var hsb = {};
		hsb.b   = Math.max( Math.max( rgb.r,rgb.g ),rgb.b );
		hsb.s   = (hsb.b <= 0) ? 0 : Math.round( 100 * (hsb.b - Math.min( Math.min( rgb.r,rgb.g ),rgb.b )) / hsb.b );
		hsb.b   = Math.round( (hsb.b / 255) * 100 );
		if ((rgb.r == rgb.g) && (rgb.g == rgb.b)) {
			hsb.h = 0;
		} else if (rgb.r >= rgb.g && rgb.g >= rgb.b) {
			hsb.h = 60 * (rgb.g - rgb.b) / (rgb.r - rgb.b);
		} else if (rgb.g >= rgb.r && rgb.r >= rgb.b) {
			hsb.h = 60 + 60 * (rgb.g - rgb.r) / (rgb.g - rgb.b);
		} else if (rgb.g >= rgb.b && rgb.b >= rgb.r) {
			hsb.h = 120 + 60 * (rgb.b - rgb.r) / (rgb.g - rgb.r);
		} else if (rgb.b >= rgb.g && rgb.g >= rgb.r) {
			hsb.h = 180 + 60 * (rgb.b - rgb.g) / (rgb.b - rgb.r);
		} else if (rgb.b >= rgb.r && rgb.r >= rgb.g) {
			hsb.h = 240 + 60 * (rgb.r - rgb.g) / (rgb.b - rgb.g);
		} else if (rgb.r >= rgb.b && rgb.b >= rgb.g) {
			hsb.h = 300 + 60 * (rgb.r - rgb.b) / (rgb.r - rgb.g);
		} else {
			hsb.h = 0;
		}
		hsb.h = Math.round( hsb.h );
		return hsb;
	};

	window.alliance_hsb2rgb = function(hsb) {
		var rgb = {};
		var h   = Math.round( hsb.h );
		var s   = Math.round( hsb.s * 255 / 100 );
		var v   = Math.round( hsb.b * 255 / 100 );
		if (s == 0) {
			rgb.r = rgb.g = rgb.b = v;
		} else {
			var t1 = v;
			var t2 = (255 - s) * v / 255;
			var t3 = (t1 - t2) * (h % 60) / 60;
			if (h == 360) {
				h = 0;
			}
			if (h < 60) {
				rgb.r = t1;	rgb.b = t2;   rgb.g = t2 + t3; } else if (h < 120) {
				rgb.g = t1; rgb.b = t2;	rgb.r = t1 - t3; } else if (h < 180) {
					rgb.g = t1; rgb.r = t2;	rgb.b = t2 + t3; } else if (h < 240) {
					rgb.b = t1; rgb.r = t2;	rgb.g = t1 - t3; } else if (h < 300) {
							rgb.b = t1; rgb.g = t2;	rgb.r = t2 + t3; } else if (h < 360) {
							rgb.r = t1; rgb.g = t2;	rgb.b = t1 - t3; } else {
								rgb.r = 0;  rgb.g = 0;	rgb.b = 0;	 }
		}
		return { r:Math.round( rgb.r ), g:Math.round( rgb.g ), b:Math.round( rgb.b ) };
	};

	window.alliance_color_picker = function(){
		var id         = arguments[0] !== undefined ? arguments[0] : "iColorPicker" + Math.round( Math.random() * 1000 );
		var colors     = arguments[1] !== undefined ? arguments[1] :
		'#f00,#ff0,#0f0,#0ff,#00f,#f0f,#fff,#ebebeb,#e1e1e1,#d7d7d7,#cccccc,#c2c2c2,#b7b7b7,#acacac,#a0a0a0,#959595,'
		+ '#ee1d24,#fff100,#00a650,#00aeef,#2f3192,#ed008c,#898989,#7d7d7d,#707070,#626262,#555,#464646,#363636,#262626,#111,#000,'
		+ '#f7977a,#fbad82,#fdc68c,#fff799,#c6df9c,#a4d49d,#81ca9d,#7bcdc9,#6ccff7,#7ca6d8,#8293ca,#8881be,#a286bd,#bc8cbf,#f49bc1,#f5999d,'
		+ '#f16c4d,#f68e54,#fbaf5a,#fff467,#acd372,#7dc473,#39b778,#16bcb4,#00bff3,#438ccb,#5573b7,#5e5ca7,#855fa8,#a763a9,#ef6ea8,#f16d7e,'
		+ '#ee1d24,#f16522,#f7941d,#fff100,#8fc63d,#37b44a,#00a650,#00a99e,#00aeef,#0072bc,#0054a5,#2f3192,#652c91,#91278f,#ed008c,#ee105a,'
		+ '#9d0a0f,#a1410d,#a36209,#aba000,#588528,#197b30,#007236,#00736a,#0076a4,#004a80,#003370,#1d1363,#450e61,#62055f,#9e005c,#9d0039,'
		+ '#790000,#7b3000,#7c4900,#827a00,#3e6617,#045f20,#005824,#005951,#005b7e,#003562,#002056,#0c004b,#30004a,#4b0048,#7a0045,#7a0026';
		var colorsList = colors.split( ',' );
		var tbl        = '<table class="colorPickerTable"><thead>';
		for (var i = 0; i < colorsList.length; i++) {
			if (i % 16 == 0) {
				tbl += (i > 0 ? '</tr>' : '') + '<tr>';
			}
			tbl += '<td style="background-color:' + colorsList[i] + '">&nbsp;</td>';
		}
		tbl += '</tr></thead><tbody>'
			+ '<tr style="height:60px;">'
			+ '<td colspan="8" id="' + id + '_colorPreview" style="vertical-align:middle;text-align:center;border:1px solid #000;background:#fff;">'
			+ '<input style="width:55px;color:#000;border:1px solid rgb(0, 0, 0);padding:5px;background-color:#fff;font:11px Arial, Helvetica, sans-serif;" maxlength="7" />'
			+ '<a href="#" id="' + id + '_moreColors" class="iColorPicker_moreColors"></a>'
			+ '</td>'
			+ '<td colspan="8" id="' + id + '_colorOriginal" style="vertical-align:middle;text-align:center;border:1px solid #000;background:#fff;">'
			+ '<input style="width:55px;color:#000;border:1px solid rgb(0, 0, 0);padding:5px;background-color:#fff;font:11px Arial, Helvetica, sans-serif;" readonly="readonly" />'
			+ '</td>'
			+ '</tr></tbody></table>';

		jQuery( document.createElement( "div" ) )
			.attr( "id", id )
			.css( 'display','none' )
			.html( tbl )
			.appendTo( "body" )
			.addClass( "iColorPickerTable" )
			.on( 'mouseover', 'thead td', function(){
					var aaa = alliance_rgb2hex( jQuery( this ).css( 'background-color' ) );
					jQuery( '#' + id + '_colorPreview' ).css( 'background',aaa );
					jQuery( '#' + id + '_colorPreview input' ).val( aaa );
				}
			)
			.on( 'keypress', '#' + id + '_colorPreview input', function(key){
					var aaa = jQuery( this ).val();
					if (aaa.length < 7 && ((key.which >= 48 && key.which <= 57) || (key.which >= 97 && key.which <= 102) || (key.which === 35 || aaa.length === 0))) {
						aaa += String.fromCharCode( key.which );
					} else if (key.which == 8 && aaa.length > 0) {
						aaa = aaa.substring( 0, aaa.length - 1 );
					} else if (key.which === 13 && (aaa.length === 4 || aaa.length === 7)) {
						var fld  = jQuery( '#' + id ).data( 'field' );
						var func = jQuery( '#' + id ).data( 'func' );
						if (func !== null && func != 'undefined') {
							func( fld, aaa );
						} else {
							fld.val( aaa ).css( 'backgroundColor', aaa ).trigger( 'change' );
						}
						jQuery( '#' + id + '_Bg' ).fadeOut( 500 );
						jQuery( '#' + id ).fadeOut( 500 );

					} else {
						key.preventDefault();
						return false;
					}
					if (aaa.substr( 0,1 ) === '#' && (aaa.length === 4 || aaa.length === 7)) {
						jQuery( '#' + id + '_colorPreview' ).css( 'background',aaa );
					}
					return true;
				}
			)
			.on( 'click', 'thead td', function(e){
					var fld  = jQuery( '#' + id ).data( 'field' );
					var func = jQuery( '#' + id ).data( 'func' );
					var aaa  = alliance_rgb2hex( jQuery( this ).css( 'background-color' ) );
					if (func !== null && func != 'undefined') {
						func( fld, aaa );
					} else {
						fld.val( aaa ).css( 'backgroundColor', aaa ).trigger( 'change' );
					}
					jQuery( '#' + id + '_Bg' ).fadeOut( 500 );
					jQuery( '#' + id ).fadeOut( 500 );
					e.preventDefault();
					return false;
				}
			)
			.on( 'click', 'tbody .iColorPicker_moreColors', function(e){
					var thead = jQuery( this ).parents( 'table' ).find( 'thead' );
					var out   = '';
					if (thead.hasClass( 'more_colors' )) {
						for (var i = 0; i < colorsList.length; i++) {
							if (i % 16 == 0) {
								out += (i > 0 ? '</tr>' : '') + '<tr>';
							}
							out += '<td style="background-color:' + colorsList[i] + '">&nbsp;</td>';
						}
						thead.removeClass( 'more_colors' ).empty().html( out + '</tr>' );
						jQuery( '#' + id + '_colorPreview' ).attr( 'colspan', 8 );
						jQuery( '#' + id + '_colorOriginal' ).attr( 'colspan', 8 );
					} else {
						var rgb = [0,0,0], i = 0, j = -1;	// Set j=-1 or j=0 - show 2 different colors layouts
						while (rgb[0] < 0xF || rgb[1] < 0xF || rgb[2] < 0xF) {
							if (i % 18 === 0) {
								out += (i > 0 ? '</tr>' : '') + '<tr>';
							}
							i++;
							out    += '<td style="background-color:' + alliance_components2hex( rgb[0] * 16 + rgb[0],rgb[1] * 16 + rgb[1],rgb[2] * 16 + rgb[2] ) + '">&nbsp;</td>';
							rgb[2] += 3;
							if (rgb[2] > 0xF) {
								rgb[1] += 3;
								if (rgb[1] > (j === 0 ? 6 : 0xF)) {
									rgb[0] += 3;
									if (rgb[0] > 0xF) {
										if (j === 0) {
											j      = 1;
											rgb[0] = 0;
											rgb[1] = 9;
											rgb[2] = 0;
										} else {
											break;
										}
									} else {
										rgb[1] = (j < 1 ? 0 : 9);
										rgb[2] = 0;
									}
								} else {
									rgb[2] = 0;
								}
							}
						}
						thead.addClass( 'more_colors' ).empty().html( out + '<td  style="background-color:#ffffff" colspan="8">&nbsp;</td></tr>' );
						jQuery( '#' + id + '_colorPreview' ).attr( 'colspan', 9 );
						jQuery( '#' + id + '_colorOriginal' ).attr( 'colspan', 9 );
					}
					jQuery( '#' + id + ' table.colorPickerTable thead td' )
					.css(
						{
							'width':'12px',
							'height':'14px',
							'border':'1px solid #000',
							'cursor':'pointer'
						}
					);
					e.preventDefault();
					return false;
				}
			);
		jQuery( document.createElement( "div" ) )
			.attr( "id", id + "_Bg" )
			.on( 'click', function(e) {
					jQuery( "#" + id + "_Bg" ).fadeOut( 500 );
					jQuery( "#" + id ).fadeOut( 500 );
					e.preventDefault();
					return false;
				}
			)
			.appendTo( "body" );
		jQuery( '#' + id + ' table.colorPickerTable thead td' )
			.css(
				{
					'width':'12px',
					'height':'14px',
					'border':'1px solid #000',
					'cursor':'pointer'
				}
			);
		jQuery( '#' + id + ' table.colorPickerTable' )
			.css( {'border-collapse':'collapse'} );
		jQuery( '#' + id )
			.css(
				{
					'border':'1px solid #ccc',
					'background':'#333',
					'padding':'5px',
					'color':'#fff'
				}
			);
		jQuery( '#' + id + '_colorPreview' )
			.css( {'height':'50px'} );
		return id;
	};

	window.alliance_color_picker_show = function(id, fld, func) {
		if (id === null || id === '') {
			id = jQuery( '.iColorPickerTable' ).attr( 'id' );
		}
		var eICP = fld.offset();
		var w    = jQuery( '#' + id ).width();
		var h    = jQuery( '#' + id ).height();
		var l    = eICP.left + w < $window.width() - 10 ? eICP.left : $window.width() - 10 - w;
		var t    = eICP.top + fld.outerHeight() + h < $window.scrollTop() + $window.height() - 10 ? eICP.top + fld.outerHeight() : eICP.top - h - 13;
		jQuery( "#" + id )
			.data( {field: fld, func: func} )
			.css(
				{
					'top':t + "px",
					'left':l + "px",
					'position':'absolute',
					'z-index':999999
				}
			)
			.fadeIn( 500 );
		jQuery( "#" + id + "_Bg" )
			.css(
				{
					'position':'fixed',
					'z-index':999998,
					'top':0,
					'left':0,
					'width':'100%',
					'height':'100%'
				}
			)
			.fadeIn( 500 );
		var def = fld.val().substr( 0, 1 ) == '#' ? fld.val() : alliance_rgb2hex( fld.css( 'backgroundColor' ) );
		jQuery( '#' + id + '_colorPreview input,#' + id + '_colorOriginal input' ).val( def );
		jQuery( '#' + id + '_colorPreview,#' + id + '_colorOriginal' ).css( 'background',def );
	};

	/* CSS functions
	---------------------------------------------------------------- */

	// Return font-family string from the font parameters
	window.alliance_get_load_fonts_family_string = function( name, family ) {
		var parts = [ name ];
		if ( alliance_alltrim( family ) != '' ) {
			parts = parts.concat( family.split( ',' ) );
		}
		for( var i = 0; i < parts.length; i++ ) {
			parts[ i ] = alliance_alltrim( parts[ i ] );
			if ( parts[ i ].indexOf( '"' ) < 0 && parts[ i ].indexOf( ' ' ) >= 0 ) {
				parts[ i ] = '"' + parts[ i ] + '"';
			}
		}
		return parts.join(',');
	};

	// Return class by prefix from classes string
	window.alliance_get_class_by_prefix = function(classes, prefix) {
		var rez = '';
		if ( classes ) {
			classes = classes.split(' ');
			for (var i=0; i < classes.length; i++) {
				if (classes[i].indexOf(prefix) >= 0) {
					rez = classes[i].replace(/[\s]+/g, '');			// Remove \t\r\n and spaces from the new class
					break;
				}
			}
		}
		return rez;
	};

	// Replace class by prefix with new value
	window.alliance_chg_class_by_prefix = function(classes, prefix, new_value) {
		var chg = false;
		if ( ! classes ) classes = '';
		classes = classes.replace(/[\s]+/g, ' ').split(' ');	// Replace groups \t\r\n and spaces with the single space
		new_value = new_value.replace(/[\s]+/g, '');			// Remove \t\r\n and spaces from the new class
		if ( typeof prefix == 'string' ) {
			prefix = [prefix];
		}
		for (var i=0; i < classes.length; i++) {
			for (var j = 0; j < prefix.length; j++ ) {
				if (classes[i].indexOf( prefix[j] ) >= 0) {
					classes[i] = new_value;
					chg = true;
					break;
				}
			}
			if ( chg ) break;
		}
		if ( ! chg && new_value ) {
			if (classes.length == 1 && classes[0] === '')
				classes[0] = new_value;
			else
				classes.push( new_value );
		}
		return classes.join(' ');
	};

	// Get inline styles and add to the page styles
	window.alliance_import_inline_styles = function( response ) {
		var selectors = alliance_apply_filters( 'alliance_filter_spa_inline_css_selectors', [
							'alliance-inline-styles-inline-css',
							'trx_addons-inline-styles-inline-css',
							'woocommerce-inline-inline-css',
//							'wpgdprc-front-css-inline-css',
							'elementor-frontend-inline-css'
						] );
		var p1, p2, inline_css, $inline_css_tag;
		for ( var i = 0; i < selectors.length; i++ ) {
			p1 = response.indexOf( selectors[i] );
			if ( p1 > 0 ) {
				p1 = response.indexOf( '>', p1 ) + 1;
				p2 = response.indexOf( '</style>', p1 ),
				inline_css = response.substring( p1, p2 ),
				$inline_css_tag = jQuery( '#' + selectors[i] );
				if ( $inline_css_tag.length === 0 ) {
					$body.append( '<style id="' + selectors[i] + '" type="text/css">' + inline_css + '</style>' );
				} else {
					$inline_css_tag.append( inline_css );
				}
			}
		}
	};


	// Get tags 'link' from response and add its to the 'head'
	window.alliance_import_tags_link = function( response ) {
		// Get links to css from response
		var links = response.match( /<link[^>]*rel=['"]stylesheet['"][^>]*id=['"]([^'"]+)['"][^>]*>/g );
		if ( links ) {
			// Prepend its to the HEAD (if not loaded in the current page)
			var $head = jQuery( 'head' );
			for ( var i = 0; i < links.length; i++ ) {
				var matches = links[i].match( /<link[^>]*rel=['"]stylesheet['"][^>]*id=['"]([^'"]+)['"][^>]*>/ );
				if ( matches && matches.length && matches.length > 1 && matches[1] ) {
					if ( jQuery( '#' + matches[1].replace('.', '\\.') ).length === 0 ) {
						$head.prepend( links[i] );
					}
				}
			}
		}
	};


	/* Cookies manipulations
	---------------------------------------------------------------- */

	window.alliance_get_cookie = function(name) {
		var defa  = arguments[1] !== undefined ? arguments[1] : null;
		var start = document.cookie.indexOf( name + '=' );
		var len   = start + name.length + 1;
		if (( ! start) && (name != document.cookie.substring( 0, name.length ))) {
			return defa;
		}
		if (start == -1) {
			return defa;
		}
		var end = document.cookie.indexOf( ';', len );
		if (end == -1) {
			end = document.cookie.length;
		}
		return unescape( document.cookie.substring( len, end ) );
	};

	window.alliance_set_cookie = function(name, value) {
		var expires  = arguments[2] !== undefined ? arguments[2] : 0;
		var path     = arguments[3] !== undefined ? arguments[3] : '/';
		var domain   = arguments[4] !== undefined ? arguments[4] : '';
		var secure   = arguments[5] !== undefined ? arguments[5] : '';
		var samesite = arguments[6] !== undefined ? arguments[6] : 'strict';	// strict | lax | none
		var today    = new Date();
		today.setTime( today.getTime() );
		var expires_date = new Date( today.getTime() + (expires * 1) );
		document.cookie  = encodeURIComponent(name) + '='
				+ encodeURIComponent( value )
				+ (expires ? ';expires=' + expires_date.toGMTString() : '')
				+ (path ? ';path=' + path : '')
				+ (domain ? ';domain=' + domain : '')
				+ (secure ? ';secure' : '')
				+ (samesite  ? ';samesite=' + samesite : '');
	};

	window.alliance_del_cookie = function(name) {
		var path     = arguments[1] !== undefined ? arguments[1] : '/';
		var domain   = arguments[2] !== undefined ? arguments[2] : '';
		var secure   = arguments[3] !== undefined ? arguments[3] : '';
		var samesite = arguments[4] !== undefined ? arguments[4] : 'strict';	// strict | lax | none
		if ( alliance_get_cookie( name ) ) {
			document.cookie = name + '='
				+ ';expires=Thu, 01-Jan-1970 00:00:01 GMT'
				+ (path ? ';path=' + path : '')
				+ (domain ? ';domain=' + domain : '')
				+ (secure ? ';secure' : '')
				+ (samesite  ? ';samesite=' + samesite : '');
		}
	};

	/* Local storage manipulations
	---------------------------------------------------------------- */

	window.alliance_is_local_storage_exists = function() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}		
	};
	
	window.alliance_get_storage = function(name) {
		var defa = arguments[1] !== undefined ? arguments[1] : null;
		var val = null;
		if (alliance_is_local_storage_exists()) {
			val = window['localStorage'].getItem(name);
			if (val === null) val = defa;
		} else {
			val = alliance_get_cookie(name, defa);
		}
		return val;
	};
	
	window.alliance_set_storage = function(name, value) {
		if (alliance_is_local_storage_exists())
			window['localStorage'].setItem(name, value);
		else 
			alliance_set_cookie(name, value, 365 * 24 * 60 * 60 * 1000);   // 1 year
	};
	
	window.alliance_del_storage = function(name) {
		if (alliance_is_local_storage_exists())
			window['localStorage'].removeItem(name);
		else 
			alliance_del_cookie(name);
	};
	
	window.alliance_clear_storage = function() {
		if (alliance_is_local_storage_exists())
			window['localStorage'].clear();
	};

	/* ListBox and ComboBox manipulations
	---------------------------------------------------------------- */

	window.alliance_clear_listbox = function(box) {
		for (var i = box.options.length - 1; i >= 0; i--) {
			box.options[i] = null;
		}
	};

	window.alliance_add_listbox_item = function(box, val, text) {
		var item   = new Option();
		item.value = val;
		item.text  = text;
		box.options.add( item );
	};

	window.alliance_del_listbox_item_by_value = function(box, val) {
		for (var i = 0; i < box.options.length; i++) {
			if (box.options[i].value == val) {
				box.options[i] = null;
				break;
			}
		}
	};

	window.alliance_del_listbox_item_by_text = function(box, txt) {
		for (var i = 0; i < box.options.length; i++) {
			if (box.options[i].text == txt) {
				box.options[i] = null;
				break;
			}
		}
	};

	window.alliance_find_listbox_item_by_value = function(box, val) {
		var idx = -1;
		for (var i = 0; i < box.options.length; i++) {
			if (box.options[i].value == val) {
				idx = i;
				break;
			}
		}
		return idx;
	};

	window.alliance_find_listbox_item_by_text = function(box, txt) {
		var idx = -1;
		for (var i = 0; i < box.options.length; i++) {
			if (box.options[i].text == txt) {
				idx = i;
				break;
			}
		}
		return idx;
	};

	window.alliance_select_listbox_item_by_value = function(box, val) {
		for (var i = 0; i < box.options.length; i++) {
			box.options[i].selected = (val == box.options[i].value);
		}
	};

	window.alliance_select_listbox_item_by_text = function(box, txt) {
		for (var i = 0; i < box.options.length; i++) {
			box.options[i].selected = (txt == box.options[i].text);
		}
	};

	window.alliance_get_listbox_values = function(box) {
		var delim = arguments[1] !== undefined ? arguments[1] : ',';
		var str   = '';
		for (var i = 0; i < box.options.length; i++) {
			str += (str ? delim : '') + box.options[i].value;
		}
		return str;
	};

	window.alliance_get_listbox_texts = function(box) {
		var delim = arguments[1] !== undefined ? arguments[1] : ',';
		var str   = '';
		for (var i = 0; i < box.options.length; i++) {
			str += (str ? delim : '') + box.options[i].text;
		}
		return str;
	};

	window.alliance_sort_listbox = function(box)  {
		var temp_opts = new Array(),
			temp      = new Option(),
			i, x, y;
		for (i = 0; i < box.options.length; i++) {
			temp_opts[i] = box.options[i].clone();
		}
		for (x = 0; x < temp_opts.length - 1; x++) {
			for (y = (x + 1); y < temp_opts.length; y++) {
				if (temp_opts[x].text > temp_opts[y].text) {
					temp         = temp_opts[x];
					temp_opts[x] = temp_opts[y];
					temp_opts[y] = temp;
				}
			}
		}
		for (i = 0; i < box.options.length; i++) {
			box.options[i] = temp_opts[i].clone();
		}
	};

	window.alliance_get_listbox_selected_index = function(box) {
		for (var i = 0; i < box.options.length; i++) {
			if (box.options[i].selected) {
				return i;
			}
		}
		return -1;
	};

	window.alliance_get_listbox_selected_value = function(box) {
		for (var i = 0; i < box.options.length; i++) {
			if (box.options[i].selected) {
				return box.options[i].value;
			}
		}
		return null;
	};

	window.alliance_get_listbox_selected_text = function(box) {
		for (var i = 0; i < box.options.length; i++) {
			if (box.options[i].selected) {
				return box.options[i].text;
			}
		}
		return null;
	};

	window.alliance_get_listbox_selected_option = function(box) {
		for (var i = 0; i < box.options.length; i++) {
			if (box.options[i].selected) {
				return box.options[i];
			}
		}
		return null;
	};

	/* Radio buttons manipulations
	---------------------------------------------------------------- */

	window.alliance_get_radio_value = function(radioGroupObj) {
		for (var i = 0; i < radioGroupObj.length; i++) {
			if (radioGroupObj[i].checked) {
				return radioGroupObj[i].value;
			}
		}
		return null;
	};

	window.alliance_set_radio_checked_by_num = function(radioGroupObj, num) {
		for (var i = 0; i < radioGroupObj.length; i++) {
			if (radioGroupObj[i].checked && i != num) {
				radioGroupObj[i].checked = false;
			} else if (i == num) {
				radioGroupObj[i].checked = true;
			}
		}
	};

	window.alliance_set_radio_checked_by_value = function(radioGroupObj, val) {
		for (var i = 0; i < radioGroupObj.length; i++) {
			if (radioGroupObj[i].checked && radioGroupObj[i].value != val) {
				radioGroupObj[i].checked = false;
			} else if (radioGroupObj[i].value == val) {
				radioGroupObj[i].checked = true;
			}
		}
	};

	/* Form manipulations
	---------------------------------------------------------------- */

	/*
	// Usage example:
	var error = alliance_form_validate(jQuery(form_selector), {		// -------- Options ---------
		error_message_show: true,									// Display or not error message
		error_message_time: 5000,									// Time to display error message
		error_message_class: 'message_box message_box_error',		// Class, appended to error message block
		error_message_text: 'Global error text',					// Global error message text (if don't write message in checked field)
		error_fields_class: 'error_field',							// Class, appended to error fields
		exit_after_first_error: false,								// Cancel validation and exit after first error
		rules: [
			{
				field: 'author',																// Checking field name
				min_length: { value: 1,	 message: 'The author name can\'t be empty' },			// Min character count (0 - don't check), message - if error occurs
				max_length: { value: 60, message: 'Too long author name'}						// Max character count (0 - don't check), message - if error occurs
			},
			{
				field: 'email',
				min_length: { value: 7,	 message: 'Too short (or empty) email address' },
				max_length: { value: 60, message: 'Too long email address'},
				mask: { value: '^([a-zA-Z0-9_\\-]+\\.)*[a-zA-Z0-9_\\-]+@[a-zA-Z0-9_\\-]+(\\.[a-zA-Z0-9_\\-]+)*\\.[a-zA-Z]{2,6}$', message: 'Invalid email address'}
			},
			{
				field: 'comment',
				min_length: { value: 1,	 message: 'The comment text can\'t be empty' },
				max_length: { value: 200, message: 'Too long comment'}
			},
			{
				field: 'pwd1',
				min_length: { value: 5,	 message: 'The password can\'t be less then 5 characters' },
				max_length: { value: 20, message: 'Too long password'}
			},
			{
				field: 'pwd2',
				equal_to: { value: 'pwd1',	 message: 'The passwords in both fields must be equals' }
			}
		]
	});
	*/

	window.alliance_form_validate = function(form, opt) {
		var error_msg = '';
		form.find( ":input" ).each(
			function() {
				if (error_msg !== '' && opt.exit_after_first_error) {
					return;
				}
				for (var i = 0; i < opt.rules.length; i++) {
					if (jQuery( this ).attr( "name" ) == opt.rules[i].field) {
						var val   = jQuery( this ).val();
						var error = false;
						if (typeof(opt.rules[i].min_length) == 'object') {
							if (opt.rules[i].min_length.value > 0 && val.length < opt.rules[i].min_length.value) {
								if (error_msg == '') {
									jQuery( this ).get( 0 ).focus();
								}
								error_msg += '<p class="error_item">' + (typeof(opt.rules[i].min_length.message) != 'undefined' ? opt.rules[i].min_length.message : opt.error_message_text ) + '</p>';
								error      = true;
							}
						}
						if (( ! error || ! opt.exit_after_first_error) && typeof(opt.rules[i].max_length) == 'object') {
							if (opt.rules[i].max_length.value > 0 && val.length > opt.rules[i].max_length.value) {
								if (error_msg == '') {
									jQuery( this ).get( 0 ).focus();
								}
								error_msg += '<p class="error_item">' + (typeof(opt.rules[i].max_length.message) != 'undefined' ? opt.rules[i].max_length.message : opt.error_message_text ) + '</p>';
								error      = true;
							}
						}
						if (( ! error || ! opt.exit_after_first_error) && typeof(opt.rules[i].mask) == 'object') {
							if (opt.rules[i].mask.value !== '') {
								var regexp = new RegExp( opt.rules[i].mask.value );
								if ( ! regexp.test( val )) {
									if (error_msg == '') {
										jQuery( this ).get( 0 ).focus();
									}
									error_msg += '<p class="error_item">' + (typeof(opt.rules[i].mask.message) != 'undefined' ? opt.rules[i].mask.message : opt.error_message_text ) + '</p>';
									error      = true;
								}
							}
						}
						if (( ! error || ! opt.exit_after_first_error) && typeof(opt.rules[i].state) == 'object') {
							if (opt.rules[i].state.value == 'checked' && ! jQuery( this ).get( 0 ).checked) {
								if (error_msg == '') {
									jQuery( this ).get( 0 ).focus();
								}
								error_msg += '<p class="error_item">' + (typeof(opt.rules[i].state.message) != 'undefined' ? opt.rules[i].state.message : opt.error_message_text ) + '</p>';
								error      = true;
							}
						}
						if (( ! error || ! opt.exit_after_first_error) && typeof(opt.rules[i].equal_to) == 'object') {
							if (opt.rules[i].equal_to.value !== '' && val != jQuery( jQuery( this ).get( 0 ).form[opt.rules[i].equal_to.value] ).val()) {
								if (error_msg == '') {
									jQuery( this ).get( 0 ).focus();
								}
								error_msg += '<p class="error_item">' + (typeof(opt.rules[i].equal_to.message) != 'undefined' ? opt.rules[i].equal_to.message : opt.error_message_text ) + '</p>';
								error      = true;
							}
						}
						if (opt.error_fields_class !== '') {
							jQuery( this ).toggleClass( opt.error_fields_class, error );
						}
					}
				}
			}
		);
		if (error_msg !== '' && opt.error_message_show) {
			var error_message_box = form.find( ".result" );
			if (error_message_box.length == 0) {
				error_message_box = form.parent().find( ".result" );
			}
			if (error_message_box.length == 0) {
				form.append( '<div class="result"></div>' );
				error_message_box = form.find( ".result" );
			}
			if (opt.error_message_class) {
				error_message_box.toggleClass( opt.error_message_class, true );
			}
			error_message_box.html( error_msg ).fadeIn();
			setTimeout( function() { error_message_box.fadeOut(); }, opt.error_message_time );
		}
		return error_msg !== '';
	};

	/* Document manipulations
	---------------------------------------------------------------- */

	// Animated scroll to selected id
	window.trx_addons_document_animate_to_busy = false;
	window.alliance_document_animate_to = function(id) {
		var split_animation = true;
		var speed    = arguments.length > 1 ? arguments[1] : -1;
		var callback = arguments.length > 2 ? arguments[2] : undefined;
		var oft = ! isNaN( id ) ? Number( id ) : 0,
			oft2 = -1;
		if (isNaN( id )) {
			if ( id.substring(0, 1) != '#' && id.substring(0, 1) != '.' ) {
				id = '#' + id;
			}
			var obj = jQuery( id ).eq( 0 );
			if (obj.length === 0) {
				return;
			}
			oft = split_animation ? obj.offset().top : Math.max( 0, obj.offset().top - alliance_fixed_rows_height() );
			if ( split_animation ) {
				oft2 = Math.max( 0, oft - alliance_fixed_rows_height() );
			}
		}
		if (speed < 0) {
			speed = Math.min( 1000, Math.max( 300, Math.round( Math.abs( ( oft2 < 0 ? oft : oft2 ) - $window.scrollTop() ) / $window.height() * 300 ) ) );
		}
		if (oft2 >= 0) {
			setTimeout( function() {
				if (isNaN( id )) {
					oft = obj.offset().top;
				}
				oft2 = Math.max( 0, oft - alliance_fixed_rows_height() );
				jQuery( 'body,html' ).stop( true ).animate( {scrollTop: oft2}, Math.floor( speed / 2 ), 'linear', function() {
					_window_scroll_top = $window.scrollTop();
					window.trx_addons_document_animate_to_busy = false;
					if ( callback ) callback( id, speed );
				} );
			}, Math.floor( speed / 2 ) );
		} else {
			oft2 = oft;
		}
		if ( speed > 0 ) {
			jQuery( 'body,html' ).stop( true ).animate( { scrollTop: oft2 }, speed, 'linear', function() {
				_window_scroll_top = $window.scrollTop();
				window.trx_addons_document_animate_to_busy = false;
				if ( callback ) callback( id, speed );
			} );
		} else {
			jQuery( 'body,html' ).stop( true ).scrollTop( oft2 );
			_window_scroll_top = $window.scrollTop();
			window.trx_addons_document_animate_to_busy = false;
			if ( callback ) callback( id, speed );
		}
	};

	// Detect window width, height and scroll
	var _window_width = $window.width(),
		_window_height = $window.height(),
		_window_scroll_top = $window.scrollTop(),
		_window_scroll_left = $window.scrollLeft();
	$window.on( 'resize', function() {
		_window_width = $window.width();
		_window_height = $window.height();
		_window_scroll_top = $window.scrollTop();
		_window_scroll_left = $window.scrollLeft();	
	} );
	$window.on( 'scroll', function() {
		_window_scroll_top = $window.scrollTop();
		_window_scroll_left = $window.scrollLeft();	
	} );
	window.alliance_window_width = function( val ) {
		if ( val ) _window_width = val;
		return _window_width;
	};
	window.alliance_window_height = function( val ) {
		if ( val ) _window_height = val;
		return _window_height;
	};
	window.alliance_window_scroll_top = function() {
		return _window_scroll_top;
	};
	window.alliance_window_scroll_left = function() {
		return _window_scroll_left;
	};

	// Detect document height
	var	_document_height;
	var _document_height_first_run = true;
	var _update_document_height = function( e ) {
		if ( typeof window.trx_addons_document_height == 'undefined' ) {
			if ( _document_height_first_run && e && e.namespace == 'init_hidden_elements' ) {
				_document_height_first_run = false;
				return; 
			}
			_document_height = $document.height();
		}
	};
	$document.ready( _update_document_height );
	$document.on( 'action.init_hidden_elements action.got_ajax_response',    // Maybe need for ' action.sc_layouts_row_fixed_on action.sc_layouts_row_fixed_off'
				_update_document_height
				);
	$window.on( 'resize', _update_document_height );
	window.alliance_document_height = function() {
		return typeof window.trx_addons_document_height != 'undefined' ? trx_addons_document_height() : _document_height;
	};

	// Detect adminbar height (if present and fixed)
	var _adminbar_height = 0;
	var _update_adminbar_height = function() {
		if ( typeof window.trx_addons_adminbar_height == 'undefined' ) {
			_adminbar_height = alliance_adminbar_height_calc();
			document.querySelector('html').style.setProperty( '--fixed-rows-height', _adminbar_height + 'px' );
		}
	};
	$document.ready( _update_adminbar_height );
	$window.on( 'resize', _update_adminbar_height );
	window.alliance_adminbar_height_calc = function() {
		return alliance_apply_filters( 'alliance_filter_adminbar_height',
										$adminbar.length === 0
											|| $adminbar.css( 'display' ) == 'none'
											|| $adminbar.css( 'position' ) == 'absolute'
												? 0
												: $adminbar.height()
									);
	};
	window.alliance_adminbar_height = function() {
		return typeof window.trx_addons_adminbar_height != 'undefined' ? trx_addons_adminbar_height() : _adminbar_height;
	};

	// Detect fixed rows height
	window.alliance_fixed_rows_height = function() {
		var with_admin_bar  = arguments.length > 0 ? arguments[0] : true,
			with_fixed_rows = arguments.length > 1 ? arguments[1] : true;
		return typeof trx_addons_fixed_rows_height != 'undefined'
					? trx_addons_fixed_rows_height( with_admin_bar, with_fixed_rows )
					: ( with_admin_bar ? alliance_adminbar_height() : 0 );
	};

	// Change browser address without reload page
	window.alliance_document_set_location = function( curLoc, state ) {
		try {
			history.pushState( state ? state : { url: curLoc }, null, curLoc );
			return;
		} catch ( e ) {}
		location.href = curLoc;
	};

	// Add/Change arguments to the url address
	window.alliance_add_to_url = function(loc, prm) {
		var ignore_empty = arguments[2] !== undefined ? arguments[2] : true;
		var q            = loc.indexOf( '?' );
		var attr         = {};
		if (q > 0) {
			var qq    = loc.substr( q + 1 ).split( '&' );
			var parts = '';
			for (var i = 0; i < qq.length; i++) {
				var parts      = qq[i].split( '=' );
				attr[parts[0]] = parts.length > 1 ? parts[1] : '';
			}
		}
		for (var p in prm) {
			attr[p] = prm[p];
		}
		loc   = (q > 0 ? loc.substr( 0, q ) : loc) + '?';
		var i = 0;
		for (p in attr) {
			if (ignore_empty && attr[p] == '') {
				continue;
			}
			loc += (i++ > 0 ? '&' : '') + p + '=' + attr[p];
		}
		return loc;
	};

	// Check if url is page-inner (local) link
	window.alliance_is_local_link = function(url) {
		var rez = url !== undefined;
		if (rez) {
			var url_pos = url.indexOf( '#' );
			if (url_pos == 0 && url.length == 1) {
				rez = false;
			} else {
				if (url_pos < 0) {
					url_pos = url.length;
				}
				var loc     = window.location.href;
				var loc_pos = loc.indexOf( '#' );
				if (loc_pos > 0) {
					loc = loc.substring( 0, loc_pos );
				}
				rez = url_pos == 0;
				if ( ! rez) {
					rez = loc == url.substring( 0, url_pos );
				}
			}
		}
		return rez;
	};

	// Check if the specified path is url
	window.alliance_is_url = function( url ) {
		return url.indexOf( '//' ) === 0 || url.indexOf( '://' ) > 0;
	};


	/* Browsers detection
	---------------------------------------------------------------- */

	window.alliance_browser_is_mobile = function() {
		var check = false;
		(function(a){if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test( a ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( a.substr( 0,4 ) )) {
				check = true}
		})( navigator.userAgent || navigator.vendor || window.opera );
		return check;
	};

	window.alliance_browser_is_ios = function() {
		return navigator.userAgent.match( /iPad|iPhone|iPod/i ) != null;
	};

	window.alliance_is_retina = function() {
		var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';
		return (window.devicePixelRatio > 1) || (window.matchMedia && window.matchMedia( mediaQuery ).matches);
	};

	/* File functions
	---------------------------------------------------------------- */

	window.alliance_get_file_name = function(path) {
		path    = path.replace( /\\/g, '/' );
		var pos = path.lastIndexOf( '/' );
		if (pos >= 0) {
			path = path.substr( pos + 1 );
		}
		return path;
	};

	window.alliance_get_file_ext = function(path) {
		var pos = path.lastIndexOf( '.' );
		path    = pos >= 0 ? path.substr( pos + 1 ) : '';
		return path;
	};

	/* Image functions
	---------------------------------------------------------------- */

	// Return true, if all images in the specified container are loaded
	window.alliance_is_images_loaded = function(cont) {
		var complete = true;
		cont.find( 'img' ).each(
			function() {
				// If any of previous images is not loaded - skip rest
				if ( ! complete) {
					return;
				}
				var img = jQuery( this ).get( 0 );
				if (typeof img.complete == 'boolean') {
					// See if "complete" property is available
					complete = img.complete;
				} else if (typeof img.naturalWidth == 'number' && typeof img.naturalHeight == 'number') {
					// See if "naturalWidth" and "naturalHeight" properties are available
					complete = ! (this.naturalWidth == 0 && this.naturalHeight == 0);
				}
			}
		);
		return complete;
	};

	// Call function when all images in the specified container are loaded
	window.alliance_when_images_loaded = function(cont, callback, max_delay) {
		if (max_delay === undefined) {
			max_delay = 3000;
		}
		if (max_delay <= 0 || alliance_is_images_loaded( cont )) {
			callback();
		} else {
			setTimeout(
				function(){
					alliance_when_images_loaded( cont, callback, max_delay - 100 );
				}, 100
			);
		}
	};



	/* Dev shorthands
	---------------------------------------------------------------- */

	window.dcl === undefined && ( window.dcl = function(s) { console.log(s); } );
	window.dcs === undefined && ( window.dcs = function() { console.trace(); } );
	window.dcts === undefined && ( window.dcts = function( name ) { console.time( name ? name : 'timer' ); } );
	window.dctl === undefined && ( window.dctl = function( name ) { console.timeLog( name ? name : 'timer' ); } );
	window.dcte === undefined && ( window.dcte = function( name ) { console.timeEnd( name ? name : 'timer' ); } );

})();
/* global jQuery, ALLIANCE_STORAGE */

jQuery( document ).ready( function() {

	"use strict";

	var ready_busy = true;

	var theme_init_counter      = 0;

	var $window                 = jQuery( window ),
		$document               = jQuery( document ),
		$body                   = jQuery( 'body' );

	var $body_wrap,
		$page_wrap,
		$header,
		$footer,
		$menu_side_wrap,
		$menu_side_logo;

	var _header_height = 0,
		_footer_height = 0;

	var $page_content_wrap,
		$content,
		$sidebar,
		$cur_page_title_tag,
		// Single post parts
		$single_nav_links_fixed,
		$single_post_info_fixed,
		$single_post_scrollers,
		$stretch_width;

	var $nav_link_infinite;


	// Update links after the new post added
	$document.on( 'action.new_post_added', update_jquery_links );
	$document.on( 'action.got_ajax_response', update_jquery_links );
	$document.on( 'action.init_hidden_elements', update_jquery_links );
	var first_run = true;
	function update_jquery_links(e) {
		if ( first_run && e && e.namespace == 'init_hidden_elements' ) {
			first_run = false;
			return; 
		}
		$body_wrap              = jQuery( '.body_wrap' ),
		$page_wrap              = jQuery( '.page_wrap' ),
		$header                 = jQuery( '.top_panel' ),
		_header_height          = $header.length === 0 ? 0 : $header.height(),
		$footer                 = jQuery( '.footer_wrap' ),
		_footer_height          = $footer.length === 0 ? 0 : $footer.height(),
		$menu_side_wrap         = jQuery( '.menu_side_wrap' ),
		$menu_side_logo         = $menu_side_wrap.find( '.sc_layouts_logo' );
		$page_content_wrap      = jQuery( '.page_content_wrap' );
		$content                = jQuery( '.content' );
		$sidebar                = jQuery( '.sidebar:not(.sidebar_fixed_placeholder)' );
		$cur_page_title_tag     = jQuery('.sc_layouts_title_caption, head title').eq(0);
		$nav_link_infinite      = jQuery( '.nav-links-infinite' );
		// Single post parts
		$single_nav_links_fixed = jQuery( '.nav-links-single.nav-links-fixed' );
		$single_post_info_fixed = jQuery( '.post_info_vertical.post_info_vertical_fixed' );
		$single_post_scrollers  = jQuery( '.nav-links-single-scroll' );
		$stretch_width          = jQuery( '.trx-stretch-width' );
	}
	update_jquery_links();


	// Init actions
	//-----------------------------------

	// Init intersection observer
	alliance_intersection_observer_init();

	// Init all other actions
	alliance_init_actions();

	function alliance_init_actions() {

		if (ALLIANCE_STORAGE['vc_edit_mode'] && jQuery( '.vc_empty-placeholder' ).length === 0 && theme_init_counter++ < 30) {
			setTimeout( alliance_init_actions, 200 );
			return;
		}

		// Resize handlers
		$window.on( 'resize', function() {
			alliance_resize_actions();
		} );

		// Scroll handlers
		ALLIANCE_STORAGE['scroll_busy'] = true;
		$window.on( 'scroll', function() {
			if (window.requestAnimationFrame) {
				if ( ! ALLIANCE_STORAGE['scroll_busy']) {
					window.requestAnimationFrame( function() {
						alliance_scroll_actions();
					});
					ALLIANCE_STORAGE['scroll_busy'] = true;
				}
			} else {
				alliance_scroll_actions();
			}
		} );

		// Add scheme class and js support
		document.documentElement.className = document.documentElement.className.replace( /\bno-js\b/,'js' );
		if (document.documentElement.className.indexOf( ALLIANCE_STORAGE['site_scheme'] ) == -1) {
			document.documentElement.className += ' ' + ALLIANCE_STORAGE['site_scheme'];
		}

		// First call to init core actions
		alliance_ready_actions();
		alliance_resize_actions();
		alliance_scroll_actions();

	}   // alliance_init_actions


	// Theme first load actions
	//==============================================
	function alliance_ready_actions() {

		// Skip to content link
		$body
			.on( 'focus', 'a.alliance_skip_link', function() {
				if ( ! $body.hasClass( 'show_outline' ) ) {
					$body.addClass( 'show_outline' );
				}
			} )
			.on( 'click', 'a.alliance_skip_link', function() {
				var id = jQuery(this).attr('href');
				jQuery(id).focus();
			} );


		// Detect the keyboard usage to show outline around links and fields
		$body.on( 'keydown', 'a,input,textarea,select,span[tabindex]', function( e ) {
			if ( 9 == e.which ) {
				if ( ! $body.hasClass( 'show_outline' ) ) {
					$body.addClass( 'show_outline' );
				}
			}
		} );


		// Menus
		//-------------------------------------
		$document
			.on( 'keyup', function(e) {
				if ( e.keyCode == 27 ) {
					if ( jQuery( '.menu_mobile.opened' ).length == 1 ) {
						alliance_mobile_menu_close();
						e.preventDefault();
						return false;
					}
				}
			} )
			.on( 'action.trx_addons_inner_links_click', function( e, link_obj, original_e ) {
				if ( $body.hasClass( 'menu_mobile_opened' ) ) {
					// Removing class before menu closing animations started
					// is need to animate inner links and scrolling to the anchor
					$body.removeClass( 'menu_mobile_opened' );
					alliance_mobile_menu_close();
				}
			} );


		// Pagination
		//------------------------------------

		// Infinite scroll in the blog streampages
		$document.on( 'action.scroll_alliance', function(e) {
			alliance_infinite_scroll_in_blog();
		} );

		// Infinite scroll in the single posts
		$document.on( 'action.scroll_alliance', function(e) {
			alliance_infinite_scroll_in_single();
		} );

		// Mark single post as readed
		if ( $body.hasClass('single') ) {
			alliance_add_to_read_list( jQuery('.content > article[data-post-id]').data('post-id') );
		}

		// Mark readed posts
		$document.on( 'action.init_hidden_elements', function( e, cont ) {
			var read_list = alliance_get_storage('alliance_post_read');
			if ( read_list && read_list.charAt(0) == '[' ) {
				read_list = JSON.parse(read_list);
				for (var p=0; p<read_list.length; p++) {
					var read_post = cont.find('[data-post-id="'+read_list[p]+'"]');
					if (!read_post.addClass('full_post_read') && !read_post.parent().hasClass('content')) {
						read_post.addClass('full_post_read');
					}
				}
			}
		} );


		// Comments
		//------------------------------------

		// Scroll to comments (if hidden)
		if ( location.hash == '#comments' || location.hash == '#respond' ) {
			var $show_comments_button = jQuery( '.show_comments_button' );
			if ( $show_comments_button.length == 1 && ! $show_comments_button.hasClass( 'opened' ) ) {
				$show_comments_button.trigger( 'click' );
				alliance_document_animate_to( location.hash );
			}
		}

		// Other settings
		//------------------------------------
		$document.trigger( 'action.ready_alliance' );

		// Blocks with stretch width
		//----------------------------------------------
		// Action to prepare stretch blocks in the third-party plugins
		$document.trigger( 'action.prepare_stretch_width' );
		// Wrap stretch blocks
		$stretch_width = jQuery( '.trx-stretch-width' );
		$stretch_width.wrap( '<div class="trx-stretch-width-wrap"></div>' );
		$stretch_width.after( '<div class="trx-stretch-width-original"></div>' );
		alliance_stretch_width();

		// Add theme-specific handlers on 'action.init_hidden_elements'
		//---------------------------------------------------------------
		$document.on( 'action.init_hidden_elements', alliance_init_post_formats );
		$document.on( 'action.init_hidden_elements', alliance_add_toc_to_sidemenu );

 		// Init hidden elements
		$document.trigger( 'action.init_hidden_elements', [$body.eq(0)] );

	} // alliance_ready_actions



	// Post formats init
	//=====================================================
	function alliance_init_post_formats(e, cont) {

		// Menu
		alliance_init_menus( cont );

		// Wrap select with .select_container
		alliance_add_select_container( cont );

		// Use Bideo or Tubular to play a local video
		alliance_init_bg_video( cont );

		// Tabs
		alliance_init_tabs( cont );

		// Accordion
		alliance_init_accordion( cont );

		// Sidebar open/close
		alliance_init_sidebar_control( cont );

		// Masonry posts
		alliance_init_masonry( cont );

		// Load more
		alliance_init_load_more( cont );

		// Open single post right in the blog or in the shortcode "Blogger"
		alliance_init_load_single_post( cont );

		// MediaElement init
		alliance_init_media_elements( cont );

		// Video play button
		alliance_init_video_play_button( cont );

		// Show/Hide Comments
		alliance_init_comments_button( cont );

		// Show comments block when link '#comments' or '#respond' is clicked
		alliance_init_comments_links( cont );

		// Checkbox with "I agree..."
		alliance_init_checkbox_i_agree( cont );

	}  // alliance_init_post_formats


	// Wrap select with .select_container
	function alliance_add_select_container( cont ) {
		if ( $body.hasClass( 'wp-admin' ) ) {
			return;
		}
		var selector = alliance_apply_filters(
			'alliance_filter_select_container_selector',
			'select:not(.esg-sorting-select):not([class*="trx_addons_attrib_"])'	//:not([size])
		);
		if ( selector ) {
			cont.find( selector ).each( function() {
				var $self = jQuery( this );
				if ( $self.css( 'display' ) != 'none'
					&& $self.parents( '.select_container' ).length === 0
					&& ! $self.next().hasClass( 'select2' )
					&& ! $self.hasClass( 'select2-hidden-accessible' )
					&& ! $self.hasClass( 'components-select-control__input' )
				) {
					var add_class = '';
					if ( $self.prop( 'size' ) > 1 ) {
						add_class += ' select_container_multirows';
					}
					if ( $self.prop( 'multiple' ) ) {
						add_class += ' select_container_multiple';
					}
					$self.wrap( '<div class="select_container' + add_class + '"></div>' );
					// Bubble submit() up for widget "Categories"
					if ( $self.parents( alliance_apply_filters( 'alliance_filter_bubble_submit_form', '.widget_categories' ) ).length > 0 ) {
						$self.parent().get(0).submit = function() {
							jQuery(this).closest('form').eq(0).submit();
						};
					}
				}
			} );
		}
	}
	// Add select_container on 'ajaxComplete'
	$document.on( 'ajaxComplete', function(e) {
		// Trigger event after timeout to allow other scripts add elements on the page
		setTimeout( function() {
			alliance_add_select_container( $body );
		}, 100 );
	} );


	// Use Bideo or Tubular to play a local video
	function alliance_init_bg_video( cont ) {
		var $top_panel_with_bg_video = cont.find( '.top_panel.with_bg_video:not(.inited)' ).addClass( 'inited' );
		if ( ALLIANCE_STORAGE['background_video'] && $top_panel_with_bg_video.length > 0 && window.Bideo ) {
			// Waiting 10ms after mejs init
			setTimeout(
				function() {
					$top_panel_with_bg_video.prepend( '<video id="background_video" loop muted></video>' );
					var bv = new Bideo();
					bv.init(
						{
							// Video element
							videoEl: document.querySelector( '#background_video' ),

							// Container element
							container: document.querySelector( '.top_panel' ),

							// Resize
							resize: true,

							// autoplay: false,

							isMobile: window.matchMedia( '(max-width: 768px)' ).matches,

							playButton: document.querySelector( '#background_video_play' ),
							pauseButton: document.querySelector( '#background_video_pause' ),

							// Array of objects containing the src and type
							// of different video formats to add
							// For example:
							//	src: [
							//			{	src: 'night.mp4', type: 'video/mp4' }
							//			{	src: 'night.webm', type: 'video/webm;codecs="vp8, vorbis"' }
							//		]
							src: [
							{
								src: ALLIANCE_STORAGE['background_video'],
								type: 'video/' + alliance_get_file_ext( ALLIANCE_STORAGE['background_video'] )
							}
							],

							// What to do once video loads (initial frame)
							onLoad: function () {
								//document.querySelector('#background_video_cover').style.display = 'none';
							}
						}
					);
				}, 10
			);

			// Use Tubular to play video from Youtube
		} else if ( jQuery.fn.tubular ) {
			cont.find( '#background_video:not(.inited)' ).each( function() {
				var $self = jQuery( this ).addClass( 'inited' );
				var youtube_code = $self.data( 'youtube-code' );
				if ( youtube_code ) {
					$self.tubular( { videoId: youtube_code } );
					jQuery( '#tubular-player' ).appendTo( $self ).show();
					jQuery( '#tubular-container,#tubular-shield' ).remove();
				}
			} );
		}
	}


	// Init media elements
	//--------------------------------------------
	ALLIANCE_STORAGE['mejs_attempts'] = 0;
	function alliance_init_media_elements(cont) {
		var audio_selector = alliance_apply_filters( 'alliance_filter_mediaelements_audio_selector', 'audio:not(.inited)' ),
			video_selector = alliance_apply_filters( 'alliance_filter_mediaelements_video_selector', 'video:not(.inited):not([nocontrols]):not([controls="0"]):not([controls="false"]):not([controls="no"])' ),	//:not([autoplay])
			media_selector = audio_selector + ( audio_selector && video_selector ? ',' : '') + video_selector;
		if (ALLIANCE_STORAGE['use_mediaelements'] && cont.find( media_selector ).length > 0) {
			if ( window.mejs ) {
				if (window.mejs.MepDefaults) {
					window.mejs.MepDefaults.enableAutosize = true;
				}
				if (window.mejs.MediaElementDefaults) {
					window.mejs.MediaElementDefaults.enableAutosize = true;
				}
				// Disable init for video[autoplay]
				cont.find(
						  // Old shortcode 'wp-video'
						  'video.wp-video-shortcode[autoplay],'
						+ 'video.wp-video-shortcode[nocontrols],'
						+ 'video.wp-video-shortcode[controls="0"],'
						+ 'video.wp-video-shortcode[controls="false"],'
						+ 'video.wp-video-shortcode[controls="no"],'
						// New block 'video'
						+ '.wp-block-video > video[autoplay],'
						+ '.wp-block-video > video[nocontrols],'
						+ '.wp-block-video > video[controls="0"],'
						+ '.wp-block-video > video[controls="false"],'
						+ '.wp-block-video > video[controls="no"]'
						)
					.removeClass('wp-video-shortcode');
				// Init mediaelements
				cont.find( media_selector ).each(
					function() {
						var $self = jQuery( this );
						// If item now invisible
						if ($self.parents( 'div:hidden,section:hidden,article:hidden' ).length > 0) {
							return;
						}
						if (   $self.addClass( 'inited' ).parents( '.mejs-mediaelement' ).length === 0
							&& $self.parents( '.wp-block-video' ).length === 0
							&& ! $self.hasClass( 'wp-block-cover__video-background' )
							&& $self.parents( '.elementor-background-video-container' ).length === 0
							&& $self.parents( '.elementor-widget-video' ).length === 0
							// Comment a next row if you want init mediaelements on the background video inside a layouts title
							&& $self.parents( '.sc_layouts_title' ).length === 0
							// Uncomment the next row to 
							// disable mediaelements init on the Elementor's video shortcode
							// to support a video ratio, specified in a shortcode parameters
							// && $self.parents( '.elementor-fit-aspect-ratio' ).length === 0
							&& ( ALLIANCE_STORAGE['init_all_mediaelements']
								|| ( ! $self.hasClass( 'wp-audio-shortcode' )
									&& ! $self.hasClass( 'wp-video-shortcode' )
									&& ! $self.parent().hasClass( 'wp-playlist' )
									)
								)
						) {
							var media_cont = $self.parents('.post_video,.video_frame').eq(0);
							if ( media_cont.length === 0 ) {
								media_cont = $self.parent();
							}
							var cont_w = media_cont.length > 0 ? media_cont.width() : -1,
								cont_h = media_cont.length > 0 ? Math.floor(cont_w / 16 * 9) : -1,
								settings = {
									enableAutosize: true,
									videoWidth:     cont_w,   // if set, overrides <video width>
									videoHeight:    cont_h,   // if set, overrides <video height>
									audioWidth:     '100%',   // width of audio player
									audioHeight:    40,	      // height of audio player
									success: function(mejs) {
										if ( mejs.pluginType && 'flash' === mejs.pluginType && mejs.attributes ) {
											mejs.attributes.autoplay
												&& 'false' !== mejs.attributes.autoplay
												&& mejs.addEventListener( 'canplay', function () { mejs.play(); }, false );
											mejs.attributes.loop
												&& 'false' !== mejs.attributes.loop
												&& mejs.addEventListener( 'ended', function () { mejs.play(); }, false );
										}
									}
								};
							$self.mediaelementplayer( settings );
						}
					}
				);
			} else if ( ALLIANCE_STORAGE['mejs_attempts']++ < 5 ) {
				setTimeout( function() { alliance_init_media_elements( cont ); }, 400 );
			}
		}
		// Init all media elements after first run
		setTimeout( function() { ALLIANCE_STORAGE['init_all_mediaelements'] = true; }, 1000 );
	}


	// Video play button
	function alliance_init_video_play_button( cont ) {
		cont.find( '.post_featured.with_thumb .post_video_hover:not(.post_video_hover_popup):not(.inited)' )
			.addClass( 'inited' )
			.on( 'click', function(e) {
				var $self = jQuery( this ),
					$post_featured = $self.parents( '.post_featured' ).eq(0);
				$post_featured
					.addClass( 'post_video_play' )
					.find( '.post_video' ).html( $self.data( 'video' ) );
				$document.trigger( 'action.init_hidden_elements', [ $post_featured ] );
				$window.trigger( 'resize' );
				e.preventDefault();
				return false;
			} )
			.parents('.post_featured')
			.on( 'click', function(e) {
				var $self = jQuery(this);
				if ( ! $self.hasClass( 'post_video_play' ) && ! jQuery( e.target ).is('a') ) {
					jQuery(this).find( '.post_video_hover' ).trigger( 'click' );
					e.preventDefault();
					return false;
				}
			} );
	}


	// Accordion
	function alliance_init_accordion( cont ) {
		if (jQuery.ui && jQuery.ui.accordion) {
			cont.find( '.alliance_accordion:not(.inited)' ).each( function () {
				var $self = jQuery( this );
				var headers = $self.data( 'headers' ) || '.alliance_accordion_title';
				// Get height style
				var height_style = $self.data( 'height-style' ) || 'content';
				// Get collapsible
				var collapsible = $self.data( 'collapsible' ) || false;
				// Get initially opened tab
				var init = $self.data( 'active' );
				var active = false;
				if ( isNaN( init ) ) {
					init = 0;
					active = $self.find( headers + '[data-active="true"]' ).eq( 0 );
					if ( active.length > 0 ) {
						while ( ! active.parent().hasClass( 'alliance_accordion' ) ) {
							active = active.parent();
						}
						init = active.index();
						if ( isNaN( init ) || init < 0 ) init = 0;
					}
				} else {
					init = Math.max( 0, init );
				}

				// Init accordion
				$self.addClass( 'inited' ).accordion( {
					'active': init,
					'collapsible': collapsible,
					'header': headers,
					'heightStyle': height_style,
					'create': function( event, ui ) {
						if ( ui.panel.length > 0 && ! ready_busy ) {
							$document.trigger( 'action.create_accordion', [ui.panel] );
							$document.trigger( 'action.init_hidden_elements', [ui.panel] );
						} else if ( active !== false && active.length > 0 ) {
							// If headers and panels wrapped into div
							active.find( '>' + headers ).trigger( 'click' );
						}
					},
					'activate': function( event, ui ) {
						if ( ui.oldPanel.length > 0 && ! ready_busy ) {
							$document.trigger( 'action.deactivate_accordion', [ui.oldPanel] );
						}
						if ( ui.newPanel.length > 0 && ! ready_busy ) {
							$document.trigger( 'action.activate_accordion', [ui.newPanel] );
							$document.trigger( 'action.init_hidden_elements', [ui.newPanel] );
							$window.trigger( 'resize' );
						}
					}
				} );
			} );
		}
	}


	// Tabs
	function alliance_init_tabs( cont ) {
		if ( jQuery.ui && jQuery.ui.tabs ) {
			cont.find( '.alliance_tabs:not(.inited)' ).each( function () {
				var $self = jQuery( this );
				// Get initially opened tab
				var init = $self.data( 'active' );
				if ( isNaN( init ) ) {
					init       = 0;
					var active = $self.find( '> ul > li[data-active="true"]' ).eq( 0 );
					if ( active.length > 0 ) {
						init = active.index();
						if (isNaN( init ) || init < 0) {
							init = 0;
						}
					}
				} else {
					init = Math.max( 0, init );
				}
				// Init tabs
				$self.addClass( 'inited' ).tabs( {
					active: init,
					show: {
						effect: 'fadeIn',
						duration: 300
					},
					hide: {
						effect: 'fadeOut',
						duration: 300
					},
					create: function( event, ui ) {
						if ( ui.panel.length > 0 && ! ready_busy ) {
							$document.trigger( 'action.create_tab', [ui.panel] );
							$document.trigger( 'action.init_hidden_elements', [ui.panel] );
						}
					},
					activate: function( event, ui ) {
						if ( ui.oldPanel.length > 0 && ! ready_busy ) {
							$document.trigger( 'action.deactivate_tab', [ui.oldPanel] );
						}
						if ( ui.newPanel.length > 0 && ! ready_busy ) {
							$document.trigger( 'action.activate_tab', [ui.newPanel] );
							$document.trigger( 'action.init_hidden_elements', [ui.newPanel] );
							$window.trigger('resize');
						}
					}
				} );
				// AJAX loader
				if ( $self.hasClass( 'alliance_tabs_ajax' ) ) {
					// AJAX loader for the tabs
					$self.on( 'tabsbeforeactivate', function( event, ui ) {
						if ( ui.newPanel.data( 'need-content' ) ) {
							alliance_tabs_ajax_content_loader( ui.newPanel, 1, ui.oldPanel );
						}
					} );
					// AJAX loader for the pages in the tabs
					$self.on( 'click', '.nav-links a', function(e) {
						var $self = jQuery( this );
						var panel = $self.parents( '.alliance_tabs_content' );
						var page  = 1;
						var href  = $self.attr( 'href' );
						var pos   = -1;
						if ( ( pos = href.lastIndexOf( '/page/' ) ) != -1 ) {
							page = Number( href.substr( pos + 6 ).replace( "/", "" ) );
							if ( ! isNaN( page )) {
								page = Math.max( 1, page );
							}
						}
						alliance_tabs_ajax_content_loader( panel, page );
						e.preventDefault();
						return false;
					} );
				}
			} );
		}
	}


	// Pagination and AJAX loaders
	//==============================================

	// Load the tab's content
	function alliance_tabs_ajax_content_loader(panel, page, oldPanel) {
		if (panel.html().replace( /\s/g, '' ) === '') {
			var height = oldPanel === undefined ? panel.height() : oldPanel.height();
			if (isNaN( height ) || height < 100) {
				height = 100;
			}
			panel.html( '<div class="alliance_tab_holder" style="min-height:' + height + 'px;"></div>' );
		} else {
			panel.find( '> *' ).addClass( 'alliance_tab_content_remove' );
		}
		panel.data( 'need-content', false ).addClass( 'alliance_loading' );
		jQuery.post(
			ALLIANCE_STORAGE['ajax_url'], {
				nonce: ALLIANCE_STORAGE['ajax_nonce'],
				action: 'alliance_ajax_get_posts',
				blog_template: panel.data( 'blog-template' ),
				blog_style: panel.data( 'blog-style' ),
				posts_per_page: panel.data( 'posts-per-page' ),
				cat: panel.data( 'cat' ),
				parent_cat: panel.data( 'parent-cat' ),
				post_type: panel.data( 'post-type' ),
				taxonomy: panel.data( 'taxonomy' ),
				page: page
			}
		).done(	function( response ) {
			panel.removeClass( 'alliance_loading' );
			var rez = {};
			try {
				rez = JSON.parse( response );
			} catch (e) {
				rez = { error: ALLIANCE_STORAGE['msg_ajax_error'] };
				console.log( response );
			}
			if (rez.error !== '') {
				panel.html( '<div class="alliance_error">' + rez.error + '</div>' );
			} else {
				// Get inline styles and add to the page styles
				if ( rez.css !== '' ) {
					alliance_import_inline_styles( '<style id="alliance-inline-styles-inline-css">' + rez.css + '</style>' );
				}
				// Append posts
				panel
					.find( '.alliance_tab_holder,.alliance_tab_content_remove' ).remove().end()
					.prepend( rez.data ).fadeIn(
						function() {
							alliance_document_animate_to('#content_skip_link_anchor');
							$document.trigger( 'action.init_hidden_elements', [panel] );
							$window.trigger( 'scroll' );
						}
					);
				$document.trigger('action.after_add_content', [panel]);
			}
			$document.trigger( 'action.got_ajax_response', {
				action: 'alliance_ajax_get_posts',
				result: rez,
				panel: panel
			} );
		} );
	} // alliance_tabs_ajax_content_loader


	// Load more
	function alliance_init_load_more( cont ) {
		cont.find( '.nav-load-more:not(.inited)' )
			.addClass( 'inited' )
			.on( 'click', function(e) {
				var more = jQuery( this );
				if ( more.data( 'load_more_link_busy' ) ) {
					return false;
				}
				var page     = Number( more.data( 'page' ) );
				var max_page = Number( more.data( 'max-page' ) );
				if ( page >= max_page ) {
					more.parent().addClass( 'all_items_loaded' ).hide();
					return false;
				}
				more.data( 'load_more_link_busy', true )
					.parent().addClass( 'loading' );

				var panel = more.parents( '.alliance_tabs_content' );

				// Load simple page content
				if (panel.length === 0) {
					jQuery.get(
						location.href, {
							paged: page + 1
						}
					).done(
						function(response) {
							// Get inline styles and add to the page styles
							alliance_import_inline_styles( response );
							// Get tags 'link' from response and add its to the 'head'
							alliance_import_tags_link( response );
							// Get new posts and append to the .posts_container
							var $response = jQuery( response );
							var $response_posts_container = $response.find('.content .posts_container');
							if ( $response_posts_container.length === 0 ) {
								$response_posts_container = $response.find('.posts_container');
							}
							if ( $response_posts_container.length > 0 ) {
								alliance_loadmore_add_items(
									$content.find( '.posts_container' ).eq( 0 ),
									$response_posts_container.find(
										'> .masonry_item,'
										+ '> div[class*="column-"],'
										+ '> article'
									)
								);
							}
							$document.trigger( 'action.got_ajax_response', {
								action: 'load_more_next_page',
								result: response
							});
						}
					);

					// Load tab's panel content
				} else {
					jQuery.post(
						ALLIANCE_STORAGE['ajax_url'], {
							nonce: ALLIANCE_STORAGE['ajax_nonce'],
							action: 'alliance_ajax_get_posts',
							blog_template: panel.data( 'blog-template' ),
							blog_style: panel.data( 'blog-style' ),
							posts_per_page: panel.data( 'posts-per-page' ),
							cat: panel.data( 'cat' ),
							parent_cat: panel.data( 'parent-cat' ),
							post_type: panel.data( 'post-type' ),
							taxonomy: panel.data( 'taxonomy' ),
							page: page + 1
						}
					).done(
						function(response) {
							var rez = {};
							try {
								rez = JSON.parse( response );
							} catch (e) {
								rez = { error: ALLIANCE_STORAGE['msg_ajax_error'] };
								console.log( response );
							}
							if (rez.error !== '') {
								panel.html( '<div class="alliance_error">' + rez.error + '</div>' );
							} else {
								// Get inline styles and add to the page styles
								if ( rez.css !== '' ) {
									alliance_import_inline_styles( '<style id="alliance-inline-styles-inline-css">' + rez.css + '</style>' );
								}
								// Get new posts and append to the .posts_container
								alliance_loadmore_add_items(
									panel.find( '.posts_container' ),
									jQuery( rez.data ).find(
										'> .masonry_item,'
										+ '> div[class*="column-"],'
										+ '> article'
									)
								);
							}
							$document.trigger( 'action.got_ajax_response', {
								action: 'alliance_ajax_get_posts',
								result: rez,
								panel: panel
							});
						}
					);
				}

				// Append items to the container
				function alliance_loadmore_add_items(container, items) {
					if (container.length > 0 && items.length > 0) {
						items.addClass( 'just_loaded_items' );
						container.append( items );
						$document.trigger('action.after_add_content', [container]);
						var just_loaded_items = container.find( '.just_loaded_items' );
						if ( container.hasClass( 'masonry_wrap' ) ) {
							just_loaded_items.addClass( 'hidden' );
							alliance_when_images_loaded(
								just_loaded_items, function() {
									just_loaded_items.removeClass( 'hidden' );
									container.masonry( 'appended', items ).masonry();
									// Remove TOC if exists (rebuild on init_hidden_elements)
									jQuery( '#toc_menu' ).remove();
									// Trigger actions to init new elements
									ALLIANCE_STORAGE['init_all_mediaelements'] = true;
									$document.trigger( 'action.init_hidden_elements', [container.parent()] );
								}
							);
						} else {
							just_loaded_items.removeClass( 'just_loaded_items hidden' );
							// Remove TOC if exists (rebuild on init_hidden_elements)
							jQuery( '#toc_menu' ).remove();
							// Trigger actions to init new elements
							ALLIANCE_STORAGE['init_all_mediaelements'] = true;
							$document.trigger( 'action.init_hidden_elements', [container.parent()] );
						}
						more.data( 'page', page + 1 ).parent().removeClass( 'loading' );
					}
					if ( page + 1 >= max_page ) {
						more.parent().addClass( 'all_items_loaded' ).hide();
					}
					more.data( 'load_more_link_busy', false );
					// Fire 'window.resize'
					$window.trigger( 'resize' );
					// Fire 'window.scroll'
					$window.trigger( 'scroll' );
				}

				e.preventDefault();
				return false;
			}
		);
	}


	// Open single post right in the blog or in the shortcode "Blogger"
	function alliance_init_load_single_post( cont ) {
		cont.find( '.posts_container:not(.inited_open_full_post),.sc_blogger_content.sc_item_posts_container:not(.inited_open_full_post)' )
			.addClass( 'inited_open_full_post' )
			.on( 'click', 'a', function(e) {
				var link = jQuery(this),
					link_url = link.attr( 'href' ),
					post = link.parents( '.post_item,.sc_blogger_item' ).eq(0),
					post_url = post.find( '.post_title > a,.entry-title > a' ).attr( 'href' ),
					posts_container = post.parents('.posts_container,.sc_item_posts_container').eq(0);
				if ( link_url && post_url && link_url == post_url
					&& ( posts_container.hasClass('open_full_post') || ALLIANCE_STORAGE['open_full_post'] )
					&& ! posts_container.hasClass('no_open_full_post')
					&& ! posts_container.hasClass('columns_wrap')
					&& ! posts_container.hasClass('masonry_wrap')
					&& posts_container.find('.sc_blogger_grid_wrap').length === 0
					&& posts_container.find('.masonry_wrap').length === 0
					&& posts_container.parents('.wp-block-columns').length === 0
					&& ( posts_container.parents('.wpb_column').length === 0 || posts_container.parents('.wpb_column').eq(0).hasClass('vc_col-sm-12') )
					&& ( posts_container.parents('.elementor-column').length === 0 || posts_container.parents('.elementor-column').eq(0).hasClass('elementor-col-100') )
				) {
					posts_container.find('.full_post_opened').removeClass('full_post_opened').show();
					posts_container.find('.full_post_content').remove();
					post.addClass('full_post_loading');
					jQuery.get( alliance_add_to_url( post_url, { 'action': 'full_post_loading' } ) ).done( function( response ) {
						if ( response ) {
							var $response = jQuery( response );
							var post_content = $response.find('.content');
							if ( post_content.length > 0 ) {
								// Get inline styles from response
								var inline_styles = response.match( /<style[^>]*id="trx_addons-inline-styles-inline-css"[^>]*>([^<]*)<\/style>/ );
								if ( inline_styles ) {
									jQuery( '#trx_addons-inline-styles-inline-css' ).append( inline_styles[1] );
								}
								// Get tags 'link' from response and add its to the 'head'
								alliance_import_tags_link( response );
								// Animate to posts_container
								var cs = post.offset().top - ( post.parents('.posts_container').length > 0 ? 100 : 200 );
								alliance_document_animate_to( cs );
								// Insert new content
								post.after( 
										'<div class="full_post_content">'
											+ '<button class="full_post_close" data-post-url="' + post_url + '"></button>'
											+ post_content.html()
										+ '</div>'
									)
									.removeClass('full_post_loading')
									.addClass('full_post_opened')
									.hide()	// instead .slideUp('fast')
									.next().slideDown( 'slow', function() {
										// Trigger actions to init new elements after posts_container is shown
										ALLIANCE_STORAGE['init_all_mediaelements'] = true;
										$document.trigger( 'action.init_hidden_elements', [posts_container] );
										$window.trigger( 'resize' );
									} );
								alliance_full_post_read_change_state();
								// Close full post content on click
								post.next().find('.full_post_close')
									.on( 'click', function(e) {
										var content = jQuery(this).parent(),
											cs = content.offset().top - (content.parents('.posts_container').length > 0 ? 100 : 200),
											post = content.prev();
										content.remove();
										alliance_full_post_read_change_state();
										post
											.removeClass('full_post_opened')
											.slideDown();
										alliance_document_animate_to( cs, 0 );
										e.preventDefault();
										return false;
									} );
								// Remove TOC if exists (rebuild on init_hidden_elements)
								jQuery( '#toc_menu' ).remove();
							}
							$document.trigger( 'action.got_ajax_response', {
								action: 'full_post_loading',
								result: response
							} );
						}
					} );
					e.preventDefault();
					return false;
				}
			} );
	}


	// Infinite scroll in the blog archive page
	function alliance_infinite_scroll_in_blog() {
		if ( ! $nav_link_infinite || $nav_link_infinite.length === 0 || $nav_link_infinite.hasClass( 'all_items_loaded' ) ) {
			return;
		}
		var container = $content.find( '> .posts_container,> .blog_archive > .posts_container,> .alliance_tabs > .alliance_tabs_content:visible > .posts_container' ).eq( 0 );
		if ( container.length == 1 && container.offset().top + container.height() < alliance_window_scroll_top() + alliance_window_height() * 1.5 ) {
			$nav_link_infinite.find( 'a' ).trigger( 'click' );
		}
	}


	// Infinite scroll in the single post
	function alliance_infinite_scroll_in_single() {
		if ( $single_post_scrollers.length === 0 ) {
			return;
		}

		var container      = ALLIANCE_STORAGE['which_block_load'] == 'article'
								? $content.eq( 0 )
								: $page_content_wrap.eq( 0 ),
			cur_page_link  = location.href,
			cur_page_title = $cur_page_title_tag.length ? $cur_page_title_tag.length : '';

		$single_post_scrollers.each( function() {
			var inf  = jQuery(this),
				link = inf.data('post-link'),
				off  = inf.offset().top,
				st   = alliance_window_scroll_top(),
				wh   = alliance_window_height();
			
			// Change location url
			if ( inf.hasClass('nav-links-single-scroll-loaded') ) {
				if (link && off < st + wh / 2) {
					cur_page_link  = link;
					cur_page_title = inf.data('post-title');
				}

			// Load next post
			} else if ( ! inf.hasClass('alliance_loading') && link && off < st + wh * 2) {
				alliance_add_to_read_list( container.find( '.previous_post_content:last-child > article[data-post-id]').data('post-id'));
				inf.addClass('alliance_loading');
				jQuery.get( alliance_add_to_url( link, { 'action': 'prev_post_loading' } ) ).done(
					function( response ) {
						// Get inline styles and add to the page styles
						alliance_import_inline_styles( response );
						// Get tags 'link' from response and add its to the 'head'
						alliance_import_tags_link( response );
						// Get article and add it to the page
						var $response = jQuery( response ),
							$response_page_content_wrap = $response.find( '.page_content_wrap' ),
							$response_content = $response.find( '.content' ),
							$response_sidebar = $response.find( '.sidebar' ),
							$response_post_content = ALLIANCE_STORAGE['which_block_load'] == 'article'
														? $response_content
														: $response_page_content_wrap;
						if ( $response_post_content.length > 0 ) {
							var html = $response_post_content.html(),
								response_body_classes = ALLIANCE_STORAGE['which_block_load'] == 'article'
														? null
														: response.match(/<body[^>]*class="([^"]*)"/);
							if ( ALLIANCE_STORAGE['which_block_load'] == 'wrapper' ) {
								if ( $response_sidebar.length === 0
									&& ! response_body_classes
									&& ! $body.hasClass( 'expand_content' )
									&& ! $body.hasClass( 'narrow_content' )
								) {
									$response_post_content.find( '.content' ).width( '100%' );
									html = $response_post_content.html();
								} else if ( $response_sidebar.length > 0 && $body.hasClass( 'narrow_content' ) ) {
									$response_post_content.find( '.post_item_single.post_type_post' ).width( '100%' );
									html = $response_post_content.html();
								}
							}
							container.append(
								'<div class="previous_post_content'
												+ ( response_body_classes
													? ' ' + response_body_classes[1]
													: '' )
												+ ( $response_page_content_wrap.attr( 'data-single-style' ) !== undefined
														? ' single_style_' + $response_page_content_wrap.attr( 'data-single-style' )
														: ''
													)
								+ '">'
									+ html
								+ '</div>'
							);
							inf.removeClass('alliance_loading').addClass( 'nav-links-single-scroll-loaded' );
							// Remove TOC if exists (rebuild on init_hidden_elements)
							jQuery( '#toc_menu' ).remove();
							// Trigger actions to init new elements
							ALLIANCE_STORAGE['init_all_mediaelements'] = true;
							$document
								.trigger( 'action.new_post_added', [container] )
								.trigger( 'action.init_hidden_elements', [container] );
							$window.trigger( 'resize' );
						}
						$document.trigger( 'action.got_ajax_response', {
							action: 'prev_post_loading',
							result: response
						});
					}
				);
			}						
		} );
		if ( cur_page_link != location.href ) {
			alliance_document_set_location( cur_page_link );
			jQuery( '.sc_layouts_title_caption,head title' ).html( cur_page_title );
		}
	}


	// Menu navigation
	//==============================================

	// Init menus after the page is loaded
	function alliance_init_menus( cont ) {

		// Stretch sidemenu after the logo is loaded
		if ( $body.hasClass( 'menu_side_present' ) && $menu_side_logo.length && ! $menu_side_logo.hasClass( 'inited_stretch' ) ) {
			$menu_side_logo.addClass( 'inited_stretch' );
			if ( ! alliance_is_images_loaded( $menu_side_logo ) ) {
				alliance_when_images_loaded( $menu_side_logo, function() {
					alliance_stretch_sidemenu();
				} );
			}
		}

		var $menus = cont.find( '.sc_layouts_menu:not(.inited_kbd)' ).addClass( 'inited_kbd' );
		// Keyboard navigation in the menus
		$menus
			.on( 'keydown', 'li > a', function(e) {
				var handled = false,
					link = jQuery( this ),
					li = link.parent(),
					ul = li.parent(),
					li_parent = ul.parent().prop( 'tagName' ) == 'LI' ? ul.parent() : false,
					item = false;
				if ( 32 == e.which ) {								// Space
					link.trigger( 'click' );
					handled = true;
				} else if ( 27 == e.which ) {						// Esc
					if ( li_parent ) {
						item = li_parent.find( '> a' );
						if ( item.length > 0 ) {
							item.get(0).focus();
						}
					}
					handled = true;
				} else if ( 37 == e.which ) {						// Left
					if ( li_parent ) {
						item = li_parent.find( '> a' );
						if ( item.length > 0 ) {
							item.get(0).focus();
						}
					} else if ( li.index() > 0 ) {
						item = li.prev().find( '> a' );
						if ( item.length > 0 ) {
							item.eq(0).focus();
						}
					}
					handled = true;
				} else if ( 38 == e.which ) {						// Top
					if ( li.index() > 0 ) {
						item = li.prev().find( '> a' );
						if ( item.length > 0 ) {
							item.get(0).focus();
						}
					} else if ( li_parent ) {
						item = li_parent.find( '> a' );
						if ( item.length > 0 ) {
							item.get(0).focus();
						}
					}
					handled = true;
				} else if ( 39 == e.which ) {						// Right
					if ( li_parent ) {
						if ( li.find( '> ul' ).length == 1 ) {
							item = li.find( '> ul > li:first-child a' );
							if ( item.length > 0 ) {
								item.get(0).focus();
							}
						}
					} else if ( li.next().prop( 'tagName' ) == 'LI' ) {
						item = li.next().find( '> a' );
						if ( item.length > 0 ) {
							item.get(0).focus();
						}
					}
					handled = true;
				} else if ( 40 == e.which ) {						// Bottom
					if ( li_parent || li.find( '> ul' ).length === 0 ) {
						if ( li.next().prop( 'tagName' ) == 'LI' ) {
							item = li.next().find( '> a' );
							if ( item.length > 0 ) {
								item.get(0).focus();
							}
						}
					} else if ( li.find( '> ul' ).length == 1 ) {
						item = li.find( '> ul > li:first-child a' );
						if ( item.length > 0 ) {
							item.get(0).focus();
						}
					}
					handled = true;
				}
				if ( handled ) {
					if ( ! $body.hasClass( 'show_outline' ) ) {
						$body.addClass( 'show_outline' );
					}
					e.preventDefault();
					return false;
				}
				return true;
			} );

		// Add images to the menu items with classes image-xxx
		$menus.find( 'li[class*="image-"]' ).each(
			function() {
				var $self   = jQuery( this );
				var classes = $self.attr( 'class' ).split( ' ' );
				var icon    = '';
				for (var i = 0; i < classes.length; i++) {
					if (classes[i].indexOf( 'image-' ) >= 0) {
						icon = classes[i].replace( 'image-', '' );
						break;
					}
				}
				if (icon) {
					$self.find( '>a' ).css( 'background-image', 'url(' + ALLIANCE_STORAGE['theme_url'] + 'trx_addons/css/icons.png/' + icon + '.png' );
				}
			}
		);

		// Open/Close side menu
		cont.find( '.menu_side_button:not(.inited)' )
			.addClass( 'inited' )
			.on( 'click', function( e ) {
				jQuery( this ).parent().toggleClass( 'opened' );
				e.preventDefault();
				return false;
			} );

		// Add arrows to the mobile menu 
		// and close the mobile menu on a link with url is clicked
		// (to prevent display a mobile menu after 'Back' pressed)
		cont.find( '.menu_mobile:not(.inited_arrows),.sc_layouts_menu_dir_vertical:not(.inited_arrows)' )
			.addClass( 'inited_arrows' )
			.find( '.menu-item-has-children > a' )
				.append( '<span class="open_child_menu"></span>' ).end()
			.find ( 'a:not([href="#"])' )
				.on( 'click', function(e) {
					alliance_mobile_menu_close();
				} );

		// Open/Close mobile menu
		function alliance_mobile_menu_open() {
			var $menu = cont.find( '.menu_mobile' );
			$menu
				.addClass( 'opened' )
				.prev( '.menu_mobile_overlay' ).fadeIn();
			$body.addClass( 'menu_mobile_opened' );
			$document
				.trigger( 'action.stop_wheel_handlers' )
				.trigger( 'action.mobile_menu_open', [$menu] );
		}
		function alliance_mobile_menu_close() {
			var $menu = cont.find( '.menu_mobile' );
			$document.trigger( 'action.mobile_menu_close', [$menu] );
			setTimeout( function() {
				$menu
					.removeClass( 'opened' )
					.prev( '.menu_mobile_overlay' ).fadeOut();
				$body.removeClass( 'menu_mobile_opened' );
				$document.trigger( 'action.start_wheel_handlers' );
			}, alliance_apply_filters( 'alliance_filter_mobile_menu_close_timeout', 0, $menu ) );
		}

		cont.find( '.sc_layouts_menu_mobile_button > a:not(.inited_click),.menu_mobile_button:not(.inited_click),.menu_mobile_description:not(.inited_click)' )
			.addClass( 'inited_click' )
			.on( 'click', function( e ) {
				var $self = jQuery( this );
				if ( $self.parent().hasClass( 'sc_layouts_menu_mobile_button_burger' )
					&& $self.next().hasClass( 'sc_layouts_menu_popup' )
				) {
					return;   // Not use 'return false' - it break event bubble and popup is not open
				}
				alliance_mobile_menu_open();
				e.preventDefault();
				return false;
			}
		);

		cont.find( '.menu_mobile_overlay:not(.inited_click)' )
			.addClass( 'inited_click' )
			.on( 'click', function(e){
				alliance_mobile_menu_close();
				e.preventDefault();
				return false;
			} );
		cont.find( '.menu_mobile_close:not(.inited_click)' )
			.addClass( 'inited_click' )
			.on( 'click', function(e){
				alliance_mobile_menu_close();
				e.preventDefault();
				return false;
			} )
			.on( 'keyup', function(e) {
				if (e.keyCode == 13) {
					if (jQuery( '.menu_mobile.opened' ).length == 1) {
						alliance_mobile_menu_close();
						e.preventDefault();
						return false;
					}
				}
			} )
			.on( 'focus', function() {
				if ( ! $body.hasClass( 'menu_mobile_opened' ) ) {
					jQuery( '#content_skip_link_anchor' ).focus();
				}
			} );

		// Open/Close mobile submenu
		cont.find( '.menu_mobile:not(.inited_click),.sc_layouts_menu_dir_vertical:not([class*="sc_layouts_submenu_"]):not(.inited_click),.sc_layouts_menu.sc_layouts_submenu_dropdown:not(.inited_click)' )
			.addClass( 'inited_click' )
			.on( 'click', 'li a, li a .open_child_menu', function(e) {
				var $self = jQuery( this );
				var $a    = $self.hasClass( 'open_child_menu' ) ? $self.parent() : $self;
				if ($a.parent().hasClass( 'menu-item-has-children' )) {
					if ($a.attr( 'href' ) == '#' || $self.hasClass( 'open_child_menu' )) {
						if ($a.siblings( 'ul:visible' ).length > 0) {
							$a.siblings( 'ul' ).slideUp().parent().removeClass( 'opened' );
						} else {
							$self.parents( 'li' ).eq(0).siblings( 'li' ).find( 'ul.sub-menu:visible,ul.sc_layouts_submenu:visible' ).slideUp().parent().removeClass( 'opened' );
							$a.siblings( 'ul' ).slideDown(
								function() {
									var $self = jQuery( this );
									// Init layouts
									if ( ! $self.hasClass( 'layouts_inited' ) && $self.parents( '.menu_mobile' ).length > 0) {
										$self.addClass( 'layouts_inited' );
										$document.trigger( 'action.init_hidden_elements', [$self] );
									}
								}
							).parent().addClass( 'opened' );
						}
					}
				}
				if ( ! $self.hasClass( 'open_child_menu' ) && $self.parents( '.menu_mobile' ).length > 0 && alliance_is_local_link( $a.attr( 'href' ) )) {
					jQuery( '.menu_mobile_close' ).trigger( 'click' );
				}
				if ( $self.hasClass( 'open_child_menu' ) || $a.attr( 'href' ) == '#' ) {
					e.preventDefault();
					return false;
				}
			} )
			.on( 'keyup', 'li a', function(e) {
				if ( e.keyCode == 9 ) {
					jQuery(this).find( '.open_child_menu' ).trigger( 'click' );
				}
			} );

		if ( ! ALLIANCE_STORAGE['trx_addons_exist'] || jQuery( '.top_panel.top_panel_default .sc_layouts_menu_default' ).length > 0) {
			// Init superfish menus
			alliance_init_sfmenu( '.sc_layouts_menu:not(.inited):not(.sc_layouts_submenu_dropdown) > ul:not(.inited)' );
			// Show menu
			jQuery( '.sc_layouts_menu:not(.inited)' ).each(
				function() {
					var $self = jQuery( this );
					if ( $self.find( '>ul.inited' ).length == 1 ) {
						$self.addClass( 'inited' );
					}
				}
			);
			// Generate 'scroll' event after the menu is showed
			$window.trigger( 'scroll' );
		}
	}


	// Init Superfish menu
	function alliance_init_sfmenu(selector) {
		jQuery( selector ).show().each(
			function() {
				var $self = jQuery( this );
				// Do not init the mobile menu - only add class 'inited'
				if ($self.addClass( 'inited' ).parents( '.menu_mobile' ).length > 0) {
					return;
				}
				var animation_in = $self.parent().data( 'animation_in' );
				if (animation_in == undefined) {
					animation_in = "none";
				}
				var animation_out = $self.parent().data( 'animation_out' );
				if (animation_out == undefined) {
					animation_out = "none";
				}
				$self.superfish(
					{
						delay: 300,
						animation: {
							opacity: 'show'
						},
						animationOut: {
							opacity: 'hide'
						},
						speed: 		animation_in != 'none' ? 500 : 200,
						speedOut:	animation_out != 'none' ? 300 : 200,
						autoArrows: false,
						dropShadows: false,
						onBeforeShow: function(ul) {
							var $self = jQuery( this ),
								$ul   = $self.parents( "ul" );
							var par_offset = 0,
								par_width = 0,
								ul_width = 0,
								ul_height = 0;
							// Detect horizontal position (left | right)
							if ( $ul.length > 1 ) {
								var w      = $page_wrap.width();
								par_offset = $ul.eq(0).offset().left;
								par_width  = $ul.eq(0).outerWidth();
								ul_width   = $self.outerWidth();
								if (par_offset + par_width + ul_width > w - 20 && par_offset - ul_width > 0) {
									$self.addClass( 'submenu_left' );
								} else {
									$self.removeClass( 'submenu_left' );
								}
							}
							// Shift vertical if menu going out the window
							if ( $self.parents( '.top_panel' ).length > 0 ) {
								ul_height      = $self.outerHeight();
								par_offset     = 0;
								var w_height   = alliance_window_height(),
									row        = $self.parents( '.sc_layouts_row' ).eq(0),
									row_offset = 0,
									row_height = 0,
									par        = $self.parent();
								while (row.length > 0) {
									row_offset += row.outerHeight();
									if (row.hasClass( 'sc_layouts_row_fixed_on' )) {
										break;
									}
									row = row.prev();
								}
								while (par.length > 0) {
									par_offset += par.position().top + par.parent().position().top;
									row_height  = par.outerHeight();
									if (par.position().top === 0) {
										break;
									}
									par = par.parents( 'li' ).eq(0);
								}
								if (row_offset + par_offset + ul_height > w_height) {
									if (par_offset > ul_height) {
										$self.css( {
											'top': 'auto',
											'bottom': '-1.4em'
										} );
									} else {
										$self.css( {
											'top': '-' + (par_offset - row_height - 2) + 'px',
											'bottom': 'auto'
										} );
									}
								}
							}
							// Animation in
							if (animation_in != 'none') {
								$self.removeClass( 'animated faster ' + animation_out );
								$self.addClass( 'animated fast ' + animation_in );
							}
						},
						onBeforeHide: function(ul) {
							if (animation_out != 'none') {
								var $self = jQuery( this );
								$self.removeClass( 'animated fast ' + animation_in );
								$self.addClass( 'animated faster ' + animation_out );
							}
						},
						onShow: function(ul) {
							var $self = jQuery( this );
							// Init layouts
							if ( ! $self.hasClass( 'layouts_inited' )) {
								$self.addClass( 'layouts_inited' );
								$document.trigger( 'action.init_hidden_elements', [$self] );
							}
						}
					}
				);
			}
		);
	}  // alliance_init_sfmenu


	// Add TOC in the side menu
	// Make this function global because it used in the elementor.js
	function alliance_add_toc_to_sidemenu() {
		if ( jQuery( '.menu_side_inner' ).length > 0 && jQuery( '#toc_menu' ).length > 0 ) {
			jQuery( '#toc_menu' ).appendTo( '.menu_side_inner' );
			alliance_stretch_sidemenu();
		}
	}


	// Sidebar open/close
	function alliance_init_sidebar_control( cont ) {
		cont.find( '.sidebar_control:not(.inited)' )
			.addClass( 'inited' )
			.on( 'click', function( e ) {
				var $self = jQuery( this ),
					$parent = $self.parent();
				$parent.toggleClass( 'opened' );
				if ( $body.hasClass( 'sidebar_small_screen_above' ) ) {
					var $next = $self.next();
					$next.slideToggle();
					if ( $parent.hasClass( 'opened' ) ) {
						setTimeout( function() {
							$document.trigger( 'action.init_hidden_elements', [$next] );
						}, 310 );
					}
				}
				e.preventDefault();
				return false;
			} );
	}


	// Masonry posts
	function alliance_init_masonry( cont ) {
		cont.find( alliance_apply_filters( 'alliance_filter_masonry_wrap', '.masonry_wrap' ) ).each( function() {
			var masonry_wrap = jQuery( this );
			if ( masonry_wrap.parents( 'div:hidden,article:hidden' ).length > 0) return;
			if ( ! masonry_wrap.hasClass( 'inited' ) ) {
				masonry_wrap.addClass( 'inited' );
				alliance_when_images_loaded( masonry_wrap, function() {
					setTimeout( function() {
									masonry_wrap.masonry( {
										itemSelector: alliance_apply_filters( 'alliance_filter_masonry_item', '.masonry_item' ),
										columnWidth: alliance_apply_filters( 'alliance_filter_masonry_item', '.masonry_item' ),
										percentPosition: true
									} );
									$window.trigger('resize');
									$window.trigger('scroll');
								}, alliance_apply_filters( 'alliance_filter_masonry_init', 10 ) );
				});
			} else {
				setTimeout( function() {
					masonry_wrap.masonry();   // Relayout after activate tab
				}, alliance_apply_filters( 'alliance_filter_masonry_reinit', 510 ) );
			}
		} );
	}

	// Show/Hide Comments
	function alliance_init_comments_button( cont ) {
		cont.find( '.show_comments_button:not(.inited)' )
			.addClass( 'inited' )
			.on( 'click', function(e) {
				var bt = jQuery(this);
				if ( bt.attr( 'href' ) == '#' ) {
					bt.toggleClass( 'opened' ).text( bt.data( bt.hasClass( 'opened' ) ? 'hide' : 'show' ) );
					var $comments_wrap = bt.parent().next();	//jQuery( '.comments_wrap' )
					$comments_wrap.slideToggle( function() {
						$comments_wrap.toggleClass( 'opened' );
						$window.trigger( 'scroll' );
					});
					e.preventDefault();
					return false;
				}
			} );
	}


	// Show comments block when link '#comments' or '#respond' is clicked
	function alliance_init_comments_links( cont ) {
		cont.find( 'a[href$="#comments"]:not(.inited),a[href$="#respond"]:not(.inited)' )
			.addClass( 'inited' )
			.on( 'click', function(e) {
				var $self = jQuery(this);
				if ( alliance_is_local_link( $self.attr( 'href') ) ) {
					var $prev_post_content = $self.parents( '.previous_post_content' ),
						$comments_wrap = $prev_post_content.length
											? $prev_post_content.find( '.comments_wrap' ).eq(0)
											: jQuery( '.comments_wrap' ).eq(0),
						$show_comments_button = $comments_wrap.prev().find('.show_comments_button ');
					if ( $comments_wrap.length ) {
						if ( $comments_wrap.css( 'display' ) == 'none' ) {
							if ($show_comments_button.length ) {
								$show_comments_button.trigger( 'click' );
							}
						}
						if ($show_comments_button.length ) {
							alliance_document_animate_to( $show_comments_button.offset().top );
						}
					}
				}
			} );
	}


	// Checkbox with "I agree..."
	function alliance_init_checkbox_i_agree( cont ) {
		var $i_agree = cont.find('input[type="checkbox"][name="i_agree_privacy_policy"]:not(.inited)'
							+ ',input[type="checkbox"][name="gdpr_terms"]:not(.inited)'
							+ ',input[type="checkbox"][name="wpgdprc"]:not(.inited)'
							+ ',input[type="checkbox"][name="AGREE_TO_TERMS"]:not(.inited)'
							+ ',input[type="checkbox"][name="acceptance"]:not(.inited)'
							);
		if ( $i_agree.length > 0 ) {
			if ( true ) {	// New way: On click Submit button - checkbox is checked
				$i_agree.each( function() {
					var chk = jQuery( this ),
						form = chk.parents('form');
					chk.addClass( 'inited' );
					form.find( 'button,input[type="submit"]' ).on( 'click', function(e) {
						if ( ! chk.get(0).checked ) {
							form.find('.trx_addons_message_box').remove();
							form.append(
								'<div class="trx_addons_message_box trx_addons_message_box_error">'
									+ ALLIANCE_STORAGE['msg_i_agree_error']
								+ '</div>'
							);
							var error_msg = form.find('.trx_addons_message_box');
							error_msg.fadeIn();
							setTimeout( function() {
								error_msg.fadeOut( function() {
									error_msg.remove();
								} );
							}, 3000 );
							e.preventDefault();
							return false;
						}
					} );
				} );
			} else {		// Old way: Disable Submit button while checkbox is not checked
				$i_agree
					.addClass('inited')
					.on('change', function(e) {
						var $self = jQuery(this),
							$bt   = $self.parents('form').find('button,input[type="submit"]');
						if ($self.get(0).checked) {
							$bt.removeAttr('disabled');
						} else {
							$bt.attr('disabled', 'disabled');
						}
					})
					.trigger('change');
			}
		}
	}


	// Init intersection observer
	//==============================================
	function alliance_intersection_observer_init() {

		if ( typeof IntersectionObserver != 'undefined' ) {
			// Create observer
			if ( typeof ALLIANCE_STORAGE['intersection_observer'] == 'undefined' ) {
				ALLIANCE_STORAGE['intersection_observer'] = new IntersectionObserver( function(entries) {
						entries.forEach( function( entry ) {
							alliance_intersection_observer_in_out( jQuery(entry.target), entry.isIntersecting || entry.intersectionRatio > 0 ? 'in' : 'out', entry );
						} );
					},
					{
						root: null,			// avoiding 'root' or setting it to 'null' sets it to default value: viewport
						rootMargin: '1px',	// increase (if positive) or decrease (if negative) root area
											// 1px is used instead 0px to avoid a problem with appear sticky elements when window is scrolled down
						threshold: 0		// 0.0 - 1.0: 0.0 - fired when top of the object enter in the viewport
											//            0.5 - fired when half of the object enter in the viewport
											//            1.0 - fired when the whole object enter in the viewport
					}
				);
			}
		} else {
			// Emulate IntersectionObserver behaviour
			$window.on( 'scroll', function() {
				if ( typeof ALLIANCE_STORAGE['intersection_observer_items'] != 'undefined' ) {
					for ( var i in ALLIANCE_STORAGE['intersection_observer_items'] ) {
						if ( ! ALLIANCE_STORAGE['intersection_observer_items'][i] || ALLIANCE_STORAGE['intersection_observer_items'][i].length === 0 ) {
							continue;
						}
						var item = ALLIANCE_STORAGE['intersection_observer_items'][i],
							item_top = item.offset().top,
							item_height = item.height();
						alliance_intersection_observer_in_out( item, item_top + item_height > alliance_window_scroll_top() && item_top < alliance_window_scroll_top() + alliance_window_height() ? 'in' : 'out' );
					}
				}
			} );
		}

		// Change state of the entry
		window.alliance_intersection_observer_in_out = function( item, state, entry ) {
			var callback = null;
			if ( state == 'in' ) {
				if ( ! item.hasClass( 'alliance_in_viewport' ) ) {
					item.addClass( 'alliance_in_viewport' );
					callback = item.data('trx-addons-intersection-callback');
					if ( callback ) {
						callback( item, true, entry );
					}
				}
			} else {
				if ( item.hasClass( 'alliance_in_viewport' ) ) {
					item.removeClass( 'alliance_in_viewport' );
					callback = item.data('trx-addons-intersection-callback');
					if ( callback ) {
						callback( item, false, entry );
					}
				}
			}
		};

		// Add elements to the observer
		window.alliance_intersection_observer_add = function( items, callback ) {
			items.each( function() {
				var $self = jQuery( this ),
					id = $self.attr( 'id' );
				if ( ! $self.hasClass( 'alliance_intersection_inited' ) ) {
					if ( ! id ) {
						id = 'io-' + ( '' + Math.random() ).replace('.', '');
						$self.attr( 'id', id );
					}
					$self.addClass( 'alliance_intersection_inited' );
					if ( callback ) {
						$self.data( 'trx-addons-intersection-callback', callback );
					}
					if ( typeof ALLIANCE_STORAGE['intersection_observer_items'] == 'undefined' ) {
						ALLIANCE_STORAGE['intersection_observer_items'] = {};
					}
					ALLIANCE_STORAGE['intersection_observer_items'][id] = $self;
					if ( typeof ALLIANCE_STORAGE['intersection_observer'] !== 'undefined' ) {
						ALLIANCE_STORAGE['intersection_observer'].observe( $self.get(0) );
					}
				}
			} );
		};

		// Remove elements from the observer
		window.alliance_intersection_observer_remove = function( items ) {
			items.each( function() {
				var $self = jQuery( this ),
					id = $self.attr( 'id' );
				if ( $self.hasClass( 'alliance_intersection_inited' ) ) {
					$self.removeClass( 'alliance_intersection_inited' );
					delete ALLIANCE_STORAGE['intersection_observer_items'][id];
					if ( typeof ALLIANCE_STORAGE['intersection_observer'] !== 'undefined' ) {
						ALLIANCE_STORAGE['intersection_observer'].unobserve( $self.get(0) );
					}
				}
			} );
		};
	}



	// Scroll actions
	//==============================================

	// Do actions when page scrolled
	function alliance_scroll_actions() {

		// Call theme/plugins specific action (if exists)
		$document.trigger( 'action.scroll_alliance' );

		// Fix/unfix sidebar
		alliance_fix_sidebar();

		// Fix/unfix nav links
		alliance_fix_nav_links();

		// Fix/unfix share links
		alliance_fix_share_links();

		// Shift top and footer panels when header position is 'Under content'
		alliance_shift_under_panels();

		// Show full post reading progress
		alliance_full_post_reading();

		// Set flag about scroll actions are finished
		ALLIANCE_STORAGE['scroll_busy'] = false;
	}

	// Add post_id to the readed list
	function alliance_add_to_read_list(post_id) {
		if ( post_id > 0 ) {
			var read_list = alliance_get_storage('alliance_post_read');
			if ( read_list && read_list.charAt(0) == '[' ) {
				read_list = JSON.parse(read_list);
			} else {
				read_list = [];
			}
			if ( read_list.indexOf(post_id) == -1 ) {
				read_list.push(post_id);
			}
			alliance_set_storage('alliance_post_read', JSON.stringify(read_list));
		}
	}

	var fpr_bt, fpr_cont, fpr_cs, fpr_ch, fpr_pw;
	function alliance_full_post_read_change_state() {
		fpr_bt = jQuery('.full_post_close');
		if ( fpr_bt.length == 1 ) {
			fpr_cont = fpr_bt.parent();
			fpr_cs   = fpr_cont.offset().top;
			fpr_ch   = fpr_cont.height();
			fpr_pw   = fpr_bt.find('.full_post_progress');
		}
	}

	// Show full post reading progress
	function alliance_full_post_reading() {
		if ( typeof fpr_bt == 'undefined' ) {
			alliance_full_post_read_change_state();
		}
		if ( fpr_bt.length == 1 ) {
			var ws = alliance_window_scroll_top(),
				wh = alliance_window_height();
			if ( ws > fpr_cs ) {
				if ( fpr_pw.length === 0 ) {
					fpr_bt.append(
						'<span class="full_post_progress">'
							+ '<svg viewBox="0 0 50 50">'
								+ '<circle class="full_post_progress_bar" cx="25" cy="25" r="22"></circle>'
							+ '</svg>'
						+ '</span>'
					);
					fpr_pw = fpr_bt.find('.full_post_progress');
				}
				var bar = fpr_pw.find('.full_post_progress_bar'),
					bar_max = parseFloat( bar.css('stroke-dasharray') );
				if ( fpr_cs + fpr_ch > ws + wh ) {
					var now = fpr_cs + fpr_ch - ( ws + wh ),
						delta = bar.data('delta');
					if ( delta == undefined ) {
						delta = now;
						bar.data('delta', delta);
					}
					bar.css('stroke-dashoffset', Math.min( 1, now / delta ) * bar_max );
					if ( now / delta < 0.5 ) {
						var post = fpr_cont.prev(),
							post_id = post.data('post-id');
						post.addClass('full_post_read');
						alliance_add_to_read_list(post_id);
					}
				} else if ( ! fpr_bt.hasClass('full_post_read_complete') ) {
					fpr_bt.addClass('full_post_read_complete');
				} else if ( fpr_cs + fpr_ch + wh / 3 < ws + wh ) {
					fpr_bt.trigger( 'click' );
				}
			} else {
				if ( fpr_pw.length !== 0 ) {
					fpr_pw.remove();
				}
			}
		}
	}  // alliance_full_post_reading

	// Shift top and footer panels when header position is 'Under content'
	function alliance_shift_under_panels() {

		if ($body.hasClass( 'header_position_under' ) && ! alliance_browser_is_mobile()) {

			// Disable 'under' behavior on small screen
			if ( $body.hasClass( 'mobile_layout' ) ) {	//alliance_window_width() < ALLIANCE_STORAGE['mobile_breakpoint_underpanels_off'] ) {
				if ( $header.css( 'position' ) == 'fixed' ) {
					// Header
					$header.css(
						{
							'position': 'relative',
							'left': 'auto',
							'top': 'auto',
							'width': 'auto',
							'transform': 'none',
							'zIndex': 3
						}
					);
					$header.find( '.top_panel_mask' ).hide();
					// Content
					$page_content_wrap.css(
						{
							'marginTop': 0,
							'marginBottom': 0,
							'zIndex': 2
						}
					);
					// Footer
					$footer.css(
						{
							'position': 'relative',
							'left': 'auto',
							'bottom': 'auto',
							'width': 'auto',
							'transform': 'none',
							'zIndex': 1
						}
					);
					$footer.find( '.top_panel_mask' ).hide();
				}
				return;
			}

			// Header
			var delta           = 50;
			var scroll_offset   = alliance_window_scroll_top();
			var header_height   = _header_height;
			var shift           = ! (/Chrome/.test( navigator.userAgent ) && /Google Inc/.test( navigator.vendor ))
									|| $header.find( '.slider_engine_revo' ).length === 0
										? 0	//1.2		// Parallax speed (if 0 - disable parallax)
										: 0;
			var mask            = $header.find( '.top_panel_mask' );
			var mask_opacity    = 0;
			var css             = {};
			if (mask.length === 0) {
				$header.append( '<div class="top_panel_mask"></div>' );
				mask = $header.find( '.top_panel_mask' );
			}
			if ( $header.css( 'position' ) !== 'fixed' ) {
				$page_content_wrap.css(
					{
						'zIndex': 5,
						'marginTop': header_height + 'px'
					}
				);
				$header.css(
					{
						'position': 'fixed',
						'left': 0,
						'top': alliance_adminbar_height() + 'px',
						'width': '100%',
						'zIndex': 3
					}
				);
			} else {
				$page_content_wrap.css( 'marginTop', header_height + 'px' );
			}
			if (scroll_offset > 0) {
				var offset = scroll_offset;	// - alliance_adminbar_height();
				if (offset <= header_height) {
					mask_opacity = Math.max( 0, Math.min( 0.8, (offset - delta) / header_height ) );
					// Don't shift header with Revolution slider in Chrome
					if (shift) {
						$header.css( 'transform', 'translate3d(0px, ' + (-Math.round( offset / shift )) + 'px, 0px)' );
					}
					mask.css(
						{
							'opacity': mask_opacity,
							'display': offset === 0 ? 'none' : 'block'
						}
					);
				} else {
					if (shift) {
						$header.css( 'transform', 'translate3d(0px, ' + (-Math.round( offset / shift )) + 'px, 0px)' );
					}
				}
			} else {
				if (shift) {
					$header.css( 'transform', 'none' );
				}
				if (mask.css( 'display' ) != 'none') {
					mask.css(
						{
							'opacity': 0,
							'display': 'none'
						}
					);
				}
			}

			// Footer
			var footer_height  = Math.min( _footer_height, alliance_window_height() );
			var footer_visible = (scroll_offset + alliance_window_height()) - ( $header.outerHeight() + $page_content_wrap.outerHeight() );
			if ( $footer.css( 'position' ) !== 'fixed' ) {
				$page_content_wrap.css(
					{
						'marginBottom': footer_height + 'px'
					}
				);
				$footer.css(
					{
						'position': 'fixed',
						'left': 0,
						'bottom': 0,
						'width': '100%',
						'zIndex': 2
					}
				);
			} else {
				$page_content_wrap.css( 'marginBottom', footer_height + 'px' );
			}
			if ( footer_visible > 0 ) {
				if ( $footer.css( 'zIndex' ) == 2 ) {
					$footer.css( 'zIndex', 4 );
				}
				mask = $footer.find( '.top_panel_mask' );
				if (mask.length === 0) {
					$footer.append( '<div class="top_panel_mask"></div>' );
					mask = $footer.find( '.top_panel_mask' );
				}
				if (footer_visible <= footer_height) {
					mask_opacity = Math.max( 0, Math.min( 0.8, (footer_height - footer_visible) / footer_height ) );
					// Don't shift header with Revolution slider in Chrome
					if (shift) {
						$footer.css( 'transform', 'translate3d(0px, ' + Math.round( (footer_height - footer_visible) / shift ) + 'px, 0px)' );
					}
					mask.css(
						{
							'opacity': mask_opacity,
							'display': footer_height - footer_visible <= 0 ? 'none' : 'block'
						}
					);
				} else {
					if (shift) {
						$footer.css( 'transform', 'none' );
					}
					if (mask.css( 'display' ) != 'none') {
						mask.css(
							{
								'opacity': 0,
								'display': 'none'
							}
						);
					}
				}
			} else {
				if ( $footer.css( 'zIndex' ) == 4 ) {
					$footer.css( 'zIndex', 2 );
				}
			}
		}
	}  // alliance_shift_under_panels


	// Fix/unfix footer
	function alliance_fix_footer() {
		if ( $body.hasClass( 'header_position_under' ) && ! alliance_browser_is_mobile() ) {
			if ( $footer.length > 0 ) {
				var ft_height = $footer.outerHeight( false ),
				pc            = $page_content_wrap,
				pc_offset     = pc.offset().top,
				pc_height     = pc.height();
				if ( pc_offset + pc_height + ft_height < alliance_window_height() ) {
					if ( $footer.css( 'position' ) != 'absolute' ) {
						$footer.css( {
							'position': 'absolute',
							'left': 0,
							'bottom': 0,
							'width' :'100%'
						} );
					}
				} else {
					if ( $footer.css( 'position' ) != 'relative' ) {
						$footer.css( {
							'position': 'relative',
							'left': 'auto',
							'bottom': 'auto'
						} );
					}
				}
			}
		}
	}  // alliance_fix_footer

	// Fix/unfix sidebar
	function alliance_fix_sidebar(force) {
		// Fix sidebar only if css sticky behaviour is not used
		if ( $body.hasClass( 'fixed_blocks_sticky' ) ) {
			return;
		}
		$sidebar.each( function() {
			var sb        = jQuery( this );
			var content   = sb.siblings( '.content' );
			var old_style = '';

			if ( content.length == 0 ) {
				return;
			}

			// Unfix when sidebar is under content
			if (content.css( 'float' ) == 'none') {
				old_style = sb.data( 'old_style' );
				if (old_style !== undefined) {
					sb.attr( 'style', old_style ).removeAttr( 'data-old_style' );
				}

			} else {

				var sb_height      = sb.outerHeight();
				var sb_shift       = 30;
				var content_height = content.outerHeight();
				var content_top    = content.offset().top;
				var content_shift  = content.position().top;

				// If sidebar shorter then content and page scrolled below the content's top
				if (sb_height < content_height && alliance_window_scroll_top() + alliance_fixed_rows_height() > content_top) {

					var sb_init = {
						'position': 'undefined',
						'float': 'none',
						'top': 'auto',
						'bottom': 'auto',
						'marginLeft': '0',
						'marginRight': '0'
					};

					if (typeof ALLIANCE_STORAGE['scroll_offset_last'] == 'undefined') {
						ALLIANCE_STORAGE['sb_top_last']        = content_top;
						ALLIANCE_STORAGE['scroll_offset_last'] = alliance_window_scroll_top();
						ALLIANCE_STORAGE['scroll_dir_last']    = 1;
					}
					var scroll_dir = alliance_window_scroll_top() - ALLIANCE_STORAGE['scroll_offset_last'];
					if (scroll_dir === 0) {
						scroll_dir = ALLIANCE_STORAGE['scroll_dir_last'];
					} else {
						scroll_dir = scroll_dir > 0 ? 1 : -1;
					}

					var sb_big = sb_height + sb_shift >= alliance_window_height() - alliance_fixed_rows_height(),
					sb_top     = sb.offset().top;

					if (sb_top < 0) {
						sb_top = ALLIANCE_STORAGE['sb_top_last'];
					}

					// If sidebar height greater then window height
					if (sb_big) {

						// If change scrolling dir
						if (scroll_dir != ALLIANCE_STORAGE['scroll_dir_last'] && sb.css( 'position' ) == 'fixed') {
							sb_init.position = 'absolute';
							sb_init.top      = sb_top + content_shift - content_top;

						// If scrolling down
						} else if (scroll_dir > 0) {
							if (alliance_window_scroll_top() + alliance_window_height() >= content_top + content_height) {
								sb_init.position = 'absolute';
								sb_init.bottom   = 0;
							} else if (alliance_window_scroll_top() + alliance_window_height() >= (sb.css( 'position' ) == 'absolute' ? sb_top : content_top) + sb_height + sb_shift) {
								sb_init.position = 'fixed';
								sb_init.bottom   = sb_shift;
							}

						// If scrolling up
						} else {
							if (alliance_window_scroll_top() + alliance_fixed_rows_height() <= sb_top) {
								sb_init.position = 'fixed';
								sb_init.top      = alliance_fixed_rows_height();
							}
						}

					// If sidebar height less then window height
					} else {
						if (alliance_window_scroll_top() + alliance_fixed_rows_height() >= content_top + content_height - sb_height) {
							sb_init.position = 'absolute';
							sb_init.bottom   = 0;
						} else {
							sb_init.position = 'fixed';
							sb_init.top      = alliance_fixed_rows_height();
						}
					}
					
					if (force && sb_init.position == 'undefined' && sb.css('position') == 'absolute') {
						sb_init.position = 'absolute';
						if (sb.css('top') != 'auto') {
							sb_init.top = sb.css('top');
						} else {
							sb_init.bottom = sb.css('bottom');
						}
					}

					// Check bounds
					if ( sb_init.position == 'absolute' || sb_init.position == 'undefined' ) {
						if ( sb_init.top == 'auto' && sb_init.bottom == 'auto' ) {
							sb_init.top = sb.offset().top;
						}
						if ( sb_init.top != 'auto' ) {
							if ( sb_init.top + sb_height > content_height ) {
								sb_init.position = 'absolute';
								sb_init.top = content_shift + content_height - sb_height;
								force = true;
							}
							if ( sb_init.top + sb_height <= content_shift + content_height && sb_init.top >= alliance_window_scroll_top() + alliance_window_height() ) {
								sb_init.position = 'fixed';
								sb_init.top      = 'auto';
								sb_init.bottom   = sb_shift;
								force = true;
							}
						}
					} else if ( sb_init.position == 'fixed' ) {
						if ( sb_init.top == 'auto' && sb_init.bottom == 'auto' && sb.css('top') != 'auto') {
							sb_init.top = parseFloat( sb.css('top') );
						}
						if ( sb_init.top != 'auto' && alliance_window_scroll_top() + sb_init.top + sb_height > content_top + content_height ) {
							sb_init.position = 'absolute';
							sb_init.top = content_shift + content_height - sb_height;
							force = true;
						}
					}

					// Set new position of the sidebar
					if (sb_init.position != 'undefined') {
						// Insert placeholder before sidebar
						var style = sb.attr('style');
						if (!style) style = '';
						if (!sb.prev().hasClass('sidebar_fixed_placeholder')) {
							sb.css(sb_init);
							ALLIANCE_STORAGE['scroll_dir_last'] = 0;
							sb.before('<div class="sidebar_fixed_placeholder '+sb.attr('class')+'"'
									   		+ (sb.data('sb') ? ' data-sb="' + sb.data('sb') + '"' : '')
									   + '></div>');
						}
						// Detect horizontal position
						sb_init.left = sb_init.position == 'fixed' || $body.hasClass('body_style_fullwide') || $body.hasClass('body_style_fullscreen')
											? sb.prev().offset().left
											: sb.prev().position().left;
						sb_init.right = 'auto';
						sb_init.width = sb.prev().width() + parseFloat(sb.prev().css('paddingLeft')) + parseFloat(sb.prev().css('paddingRight'));
						// Set position
						if (force
							|| sb.css('position') != sb_init.position 
							|| ALLIANCE_STORAGE['scroll_dir_last'] != scroll_dir
							|| sb.width() != sb_init.width) {
							if (sb.data('old_style') === undefined) {
								sb.attr('data-old_style', style);
							}
							sb.css(sb_init);
						}
					}

					ALLIANCE_STORAGE['sb_top_last']        = sb_top;
					ALLIANCE_STORAGE['scroll_offset_last'] = alliance_window_scroll_top();
					ALLIANCE_STORAGE['scroll_dir_last']    = scroll_dir;

				} else {

					// Unfix when page scrolling to top
					old_style = sb.data( 'old_style' );
					if (old_style !== undefined) {
						sb.attr( 'style', old_style ).removeAttr( 'data-old_style' );
						if (sb.prev().hasClass('sidebar_fixed_placeholder')) {
							sb.prev().remove();
						}
					}

				}
			}
		} );
	}  // alliance_fix_sidebar

	// Fix/unfix .nav_links_fixed
	function alliance_fix_nav_links() {
		if ( $single_nav_links_fixed.length > 0 && $single_nav_links_fixed.css( 'position' ) == 'fixed') {
			var window_bottom = alliance_window_scroll_top() + alliance_window_height(),
				article = jQuery('.post_item_single'),
				article_top = article.length > 0 ? article.offset().top : alliance_window_height(),
				article_bottom = article_top + ( article.length > 0 ? article.height() * 2 / 3 : 0 ),
				footer_top = $footer.length > 0 ? $footer.offset().top : 100000;
			if ( article_bottom < window_bottom && footer_top > window_bottom ) {
				if ( ! $single_nav_links_fixed.hasClass('nav-links-visible') ) {
					$single_nav_links_fixed.addClass('nav-links-visible');
				}
			} else {
				if ( $single_nav_links_fixed.hasClass('nav-links-visible') ) {
					$single_nav_links_fixed.removeClass('nav-links-visible');
				}					
			}
		}
	}

	// Fix/unfix .post_info_vertical_fixed
	function alliance_fix_share_links() {
		if ( $single_post_info_fixed.length > 0 ) {
			var frh = alliance_fixed_rows_height() + 10,
				st = alliance_window_scroll_top() + frh;
			$single_post_info_fixed.each( function() {
				var share_links = jQuery(this),
					share_links_top = share_links.offset().top,
					share_links_left = share_links.offset().left,
					share_links_height = share_links.height(),
					share_links_position = share_links.css( 'position' ),
					article = share_links.parents('.post_content'),
					article_top = article.offset().top,
					article_bottom = article_top + article.height();
				if ( share_links_position == 'absolute') {
					if ( st >= article_top && st + share_links_height < article_bottom ) {
						share_links
							.data('abs-pos', {
								'left': share_links.css('left'), 
								'top':  share_links.css('top')})
							.addClass('post_info_vertical_fixed_on')
							.css({
								'top':  frh,
								'left': share_links_left
							});
					}
				} else if ( share_links_position == 'fixed' ) {
					if ( st < article_top ) {
						if ( share_links.hasClass( 'post_info_vertical_fixed_on' ) ) {
							var abs_pos = share_links.data('abs-pos');
							share_links
								.removeClass( 'post_info_vertical_fixed_on' )
								.css({
									'top': abs_pos.top,
									'left': abs_pos.left
								});
						}
					} else if ( st + share_links_height >= article_bottom ) {
						share_links.fadeOut();
					} else if ( share_links.css('display') == 'none' ) {
						share_links.fadeIn();
					}
				}
			});
		}
	}




	// Resize actions
	//==============================================

	// Do actions when page scrolled
	function alliance_resize_actions(cont) {

		// Update global values
		_header_height = $header.length === 0 ? 0 : $header.height();
		_footer_height = $footer.length === 0 ? 0 : $footer.height();
		
		// Call handlers
		alliance_check_layout();
		alliance_fix_sidebar(true);
		alliance_fix_footer();
		alliance_fix_nav_links();
		alliance_stretch_width( cont );
		alliance_stretch_bg_video();
		alliance_vc_row_fullwidth_to_boxed( cont );
		alliance_stretch_sidemenu();
		alliance_resize_video( cont );
		alliance_shift_under_panels();

		// Call theme/plugins specific action (if exists)
		//----------------------------------------------
		$document.trigger( 'action.resize_alliance', [cont] );
	}

	// Stretch sidemenu (if present)
	function alliance_stretch_sidemenu() {
		var toc_items = $menu_side_wrap.find( '.toc_menu_item' );
		if (toc_items.length === 0) {
			return;
		}
		var toc_items_height = alliance_window_height()
							- alliance_adminbar_height()
							- $menu_side_logo.outerHeight()
							- toc_items.length;
		var th               = Math.floor( toc_items_height / toc_items.length );
		var th_add           = toc_items_height - th * toc_items.length;
		if (ALLIANCE_STORAGE['menu_side_stretch'] && toc_items.length >= 5 && th >= 30) {
			toc_items.find( ".toc_menu_description,.toc_menu_icon" ).css(
				{
					'height': th + 'px',
					'lineHeight': th + 'px'
				}
			);
			toc_items.eq( 0 ).find( ".toc_menu_description,.toc_menu_icon" ).css(
				{
					'height': (th + th_add) + 'px',
					'lineHeight': (th + th_add) + 'px'
				}
			);
		}
		//$menu_side_wrap.find('#toc_menu').height(toc_items_height + toc_items.length - toc_items.eq(0).height());
	}

	// Scroll sidemenu (if present)
	$document.on( 'action.toc_menu_item_active', function() {
		var toc_menu = $menu_side_wrap.find( '#toc_menu' );
		if (toc_menu.length === 0) {
			return;
		}
		var toc_items = toc_menu.find( '.toc_menu_item' );
		if (toc_items.length === 0) {
			return;
		}
		var th           = toc_items.eq( 0 ).height(),
		toc_menu_pos     = parseFloat( toc_menu.css( 'top' ) ),
		toc_items_height = toc_items.length * th,
		menu_side_height = alliance_window_height()
							- alliance_adminbar_height()
							- $menu_side_logo.outerHeight()
							- $menu_side_logo.next( '.toc_menu_item' ).outerHeight();
		if ( toc_items_height > menu_side_height ) {
			var toc_item_active = $menu_side_wrap.find( '.toc_menu_item_active' ).eq( 0 );
			if ( toc_item_active.length == 1 ) {
				var toc_item_active_pos = (toc_item_active.index() + 1) * th;
				if (toc_menu_pos + toc_item_active_pos > menu_side_height - th) {
					toc_menu.css( 'top', Math.max( -toc_item_active_pos + 3 * th, menu_side_height - toc_items_height ) );
				} else if (toc_menu_pos < 0 && toc_item_active_pos < -toc_menu_pos + 2 * th) {
					toc_menu.css( 'top', Math.min( -toc_item_active_pos + 3 * th, 0 ) );
				}
			}
		} else if ( toc_menu_pos < 0 ) {
			toc_menu.css( 'top', 0 );
		}
	} );

	// Check for mobile layout
	function alliance_check_layout() {
		var resize = true;
		if ( $body.hasClass( 'no_layout' ) ) {
			$body.removeClass( 'no_layout' );
			resize = false;
		}
		var w = window.innerWidth;
		if (w == undefined) {
			w = alliance_window_width() + ( alliance_window_height() < alliance_document_height() || alliance_window_scroll_top() > 0 ? 16 : 0 );
		}
		if ( w < ALLIANCE_STORAGE['mobile_layout_width'] ) {
			if ( ! $body.hasClass( 'mobile_layout' )) {
				$body.removeClass( 'desktop_layout' ).addClass( 'mobile_layout' );
				$document.trigger( 'action.switch_to_mobile_layout' );
				if (resize) {
					$window.trigger( 'resize' );
				}
			}
		} else {
			if ( ! $body.hasClass( 'desktop_layout' )) {
				$body.removeClass( 'mobile_layout' ).addClass( 'desktop_layout' );
				jQuery( '.menu_mobile' ).removeClass( 'opened' );
				jQuery( '.menu_mobile_overlay' ).hide();
				$document.trigger( 'action.switch_to_desktop_layout' );
				if ( resize ) {
					$window.trigger( 'resize' );
				}
			}
		}
		if (ALLIANCE_STORAGE['mobile_device'] || alliance_browser_is_mobile()) {
			$body.addClass( 'mobile_device' );
		}
	}

	// Stretch area to full window width
	function alliance_stretch_width(cont) {
		if (cont === undefined) {
			cont = $body;
		}
		$stretch_width.each(
			function() {
				var $el             = jQuery( this );
				var $el_cont        = $el.parents( '.page_wrap' );
				var $el_cont_offset = 0;
				if ($el_cont.length === 0) {
					$el_cont = $window;
				} else {
					$el_cont_offset = $el_cont.offset().left;
				}
				var $el_full        = $el.next( '.trx-stretch-width-original' );
				var el_margin_left  = parseInt( $el.css( 'margin-left' ), 10 );
				var el_margin_right = parseInt( $el.css( 'margin-right' ), 10 );
				var offset          = $el_cont_offset - $el_full.offset().left - el_margin_left;
				var width           = $el_cont.width();
				if ( ! $el.hasClass( 'inited' )) {
					$el.addClass( 'inited invisible' );
					$el.css(
						{
							'position': 'relative',
							'box-sizing': 'border-box'
						}
					);
				}
				$el.css(
					{
						'left': offset,
						'width': $el_cont.width()
					}
				);
				if ( ! $el.hasClass( 'trx-stretch-content' ) ) {
					var padding      = Math.max( 0, -1 * offset );
					var paddingRight = Math.max( 0, width - padding - $el_full.width() + el_margin_left + el_margin_right );
					$el.css( { 'padding-left': padding + 'px', 'padding-right': paddingRight + 'px' } );
				}
				$el.removeClass( 'invisible' );
			}
		);
	}  // alliance_stretch_width

	// Resize video frames
	function alliance_resize_video(cont) {
		if (cont === undefined) {
			cont = $body;
		}
		// Resize tags 'video'
		cont.find( 'video' ).each( function() {
			var $self = jQuery( this );
			// If item now invisible
			if ( ( ! ALLIANCE_STORAGE['resize_tag_video'] && $self.parents('.mejs-mediaelement').length === 0 )
				|| $self.hasClass( 'trx_addons_resize' )
				|| $self.hasClass( 'trx_addons_noresize' )
				|| $self.parents( 'div:hidden,section:hidden,article:hidden' ).length > 0
			) {
				return;
			}
			var video     = $self.addClass( 'alliance_resize' ).eq( 0 );
			var ratio     = (video.data( 'ratio' ) !== undefined ? video.data( 'ratio' ).split( ':' ) : [16,9]);
			ratio         = ratio.length != 2 || ratio[0] === 0 || ratio[1] === 0 ? 16 / 9 : ratio[0] / ratio[1];
			var mejs_cont = video.parents( '.mejs-video' ).eq(0);
			var mfp_cont  = video.parents( '.mfp-content' ).eq(0);
			var w_attr    = video.data( 'width' );
			var h_attr    = video.data( 'height' );
			if ( ! w_attr || ! h_attr) {
				w_attr = video.attr( 'width' );
				h_attr = video.attr( 'height' );
				if ( ! w_attr || ! h_attr) {
					return;
				}
				video.data( {'width': w_attr, 'height': h_attr} );
			}
			var percent = ('' + w_attr).substr( -1 ) == '%';
			w_attr      = parseInt( w_attr, 10 );
			h_attr      = parseInt( h_attr, 10 );
			var w_real  = Math.ceil(
							mejs_cont.length > 0
									? Math.min( percent ? 10000 : w_attr, mejs_cont.parents( 'div,article' ).eq(0).width() )
									: Math.min( percent ? 10000 : w_attr, video.parents( 'div,article' ).eq(0).width() )
			);
			if ( mfp_cont.length > 0 ) {
				w_real  = Math.max( mfp_cont.width(), w_real );
			}
			var h_real  = Math.ceil( percent ? w_real / ratio : w_real / w_attr * h_attr );
			if ( parseInt( video.attr( 'data-last-width' ), 10 ) == w_real ) {
				return;
			}
			if ( percent ) {
				video.height( h_real );
			} else if ( video.parents( '.wp-video-playlist' ).length > 0 ) {
				if ( mejs_cont.length === 0 ) {
					video.attr( {'width': w_real, 'height': h_real} );
				}
			} else {
				video.attr( {'width': w_real, 'height': h_real} ).css( {'width': w_real + 'px', 'height': h_real + 'px'} );
				if ( mejs_cont.length > 0 ) {
					alliance_set_mejs_player_dimensions( video, w_real, h_real );
				}
			}
			video.attr( 'data-last-width', w_real );
		} );

		// Resize tags 'iframe'
		if ( ALLIANCE_STORAGE['resize_tag_iframe'] ) {
			cont.find( '.video_frame iframe,iframe' ).each( function() {
				var $self = jQuery( this );
				// If item now invisible
				if ( $self.hasClass( 'trx_addons_resize' ) || $self.hasClass( 'trx_addons_noresize' ) || $self.addClass( 'alliance_resize' ).parents( 'div:hidden,section:hidden,article:hidden' ).length > 0 ) {
					return;
				}
				var iframe = $self.eq( 0 );
				if (iframe.length === 0 || iframe.attr( 'src' ) === undefined || iframe.attr( 'src' ).indexOf( 'soundcloud' ) > 0) {
					return;
				}
				var ratio  = (iframe.data( 'ratio' ) !== undefined
								? iframe.data( 'ratio' ).split( ':' )
								: (iframe.parent().data( 'ratio' ) !== undefined
									? iframe.parent().data( 'ratio' ).split( ':' )
									: (iframe.find( '[data-ratio]' ).length > 0
										? iframe.find( '[data-ratio]' ).data( 'ratio' ).split( ':' )
										: (iframe.attr('width') && iframe.attr('height')
											? [iframe.attr('width'), iframe.attr('height')]
											: [16, 9]
											)
										)
									)
								);
				ratio      = ratio.length != 2 || ratio[0] === 0 || ratio[1] === 0 ? 16 / 9 : ratio[0] / ratio[1];
				var w_attr = iframe.attr( 'width' );
				var h_attr = iframe.attr( 'height' );
				if ( ! w_attr || ! h_attr ) {
					return;
				}
				var percent   = ('' + w_attr).substr( -1 ) == '%';
				w_attr        = parseInt( w_attr, 10 );
				h_attr        = parseInt( h_attr, 10 );
				var par       = iframe.parents( 'div,section' ).eq(0),
					contains  = iframe.data('contains-in-parent')=='1' || iframe.hasClass('contains-in-parent'),
					nostretch = iframe.data('no-stretch-to-parent')=='1' || iframe.hasClass('no-stretch-to-parent'),
					pw        = Math.ceil( par.width() ),
					ph        = Math.ceil( par.height() ),
					w_real    = nostretch ? Math.min( w_attr, pw ) : pw,
					h_real    = Math.ceil( percent ? w_real / ratio : w_real / w_attr * h_attr );
				if ( contains && par.css( 'position' ) == 'absolute' && h_real > ph) {
					h_real = ph;
					w_real = Math.ceil( percent ? h_real * ratio : h_real * w_attr / h_attr );
				}
				if (parseInt( iframe.attr( 'data-last-width' ), 10 ) == w_real) {
					return;
				}
				iframe.css( {'width': w_real + 'px', 'height': h_real + 'px'} );
				iframe.attr( 'data-last-width', w_real );
			} );
		}
	}  // alliance_resize_video

	// Set Media Elements player dimensions
	function alliance_set_mejs_player_dimensions(video, w, h) {
		if (mejs) {
			for (var pl in mejs.players) {
				if (mejs.players[pl].media.src == video.attr( 'src' )) {
					if (mejs.players[pl].media.setVideoSize) {
						mejs.players[pl].media.setVideoSize( w, h );
					} else if (mejs.players[pl].media.setSize) {
						mejs.players[pl].media.setSize( w, h );
					}
					mejs.players[pl].setPlayerSize( w, h );
					mejs.players[pl].setControlsSize();
				}
			}
		}
	}

	// Stretch background video
	function alliance_stretch_bg_video() {
		var video_wrap = jQuery( 'div#background_video,.tourmaster-background-video' );
		if (video_wrap.length === 0) {
			return;
		}
		var cont = video_wrap.hasClass( 'tourmaster-background-video' ) ? video_wrap.parent() : video_wrap,
		w        = cont.width(),
		h        = cont.height(),
		video    = video_wrap.find( '>iframe,>video' );
		if (w / h < 16 / 9) {
			w = h / 9 * 16;
		} else {
			h = w / 16 * 9;
		}
		video
			.attr( {'width': w, 'height': h} )
			.css( {'width': w, 'height': h} );
	}

	// Recalculate width of the vc_row[data-vc-full-width="true"] when content boxed or menu_side=='left|right'
	$document.on('vc-full-width-row action.before_resize_trx_addons', function(e, container) {
		alliance_vc_row_fullwidth_to_boxed( jQuery(container) );
	});
	function alliance_vc_row_fullwidth_to_boxed(cont) {
		if ( $body.hasClass( 'body_style_boxed' )
			|| $body.hasClass( 'menu_side_present' )
			|| parseInt($page_wrap.css('paddingLeft'), 10) > 0
		) {
			if (cont === undefined || ! cont.hasClass( '.vc_row' ) || ! cont.data( 'vc-full-width' )) {
				cont = jQuery( '.vc_row[data-vc-full-width="true"]' );
			}
			var rtl                = jQuery( 'html' ).attr( 'dir' ) == 'rtl';
			var page_wrap_pl       = parseInt( $page_wrap.css('paddingLeft'), 10 );
			if ( isNaN( page_wrap_pl ) ) {
				page_wrap_pl = 0;
			}
			var page_wrap_pr       = parseInt( $page_wrap.css('paddingRight'), 10 );
			if ( isNaN( page_wrap_pr ) ) {
				page_wrap_pr = 0;
			}
			var page_wrap_width    = $page_wrap.outerWidth() - page_wrap_pl - page_wrap_pr;
			var content_wrap       = $page_content_wrap.find( '.content_wrap' );
			var content_wrap_width = content_wrap.width();
			var indent             = ( page_wrap_width - content_wrap_width ) / 2;
			cont.each( function() {
				var $self           = jQuery( this );
				var mrg             = parseInt( $self.css( 'marginLeft' ), 10 );
				var stretch_content = $self.attr( 'data-vc-stretch-content' );
				var stretch_row     = $self.attr( 'data-vc-full-width' );
				var in_content      = $self.parents( '.content_wrap' ).length > 0;
				$self.css( {
					'width':         in_content && ! stretch_content && ! stretch_row ? Math.min( page_wrap_width, content_wrap_width ) : page_wrap_width,
					'left':          rtl ? 'auto' : ( in_content ? -indent : 0 ) - mrg,
					'right':         ! rtl ? 'auto' : ( n_content ? -indent : 0 ) - mrg,
					'padding-left':  stretch_content ? 0 : indent + mrg,
					'padding-right': stretch_content ? 0 : indent + mrg
				} );
			} );
		}
	}

	ready_busy = false;

} );
/* global jQuery:false */
/* global ALLIANCE_STORAGE:false */

( function() {
	"use strict";

	var $window   = jQuery( window ),
		$document = jQuery( document ),
		$html = jQuery('html'),
		$body = jQuery('body'),
		$header = jQuery('.top_panel'),
		$footer = jQuery('.footer_wrap'),
		$content_wrap = jQuery('.content_wrap'),
		$menu_mobile = jQuery('.menu_mobile'),
		$color_switcher = jQuery('#color_scheme_switcher'),
		header_height = 0,
		footer_height = 0,
		top_panel_height = 0,
		fixed_height = 0,
		header_resize = 0;



	/* Init
	-----------------------------------------------------------------*/
	// Page blocks
	alliance_skin_page_content_blocks_init();

	// Side (mobile) menu
	alliance_skin_menu_side_init();

	// Posts order
	alliance_skin_posts_order_init();

	// Radio & Checkbox
	alliance_skin_radio_checkbox_init();

	// Page content switcher
	alliance_skin_content_switcher_init();

	// Color switcher
	alliance_skin_color_switcher_init();

	// Search init
	alliance_skin_search_init();

	// Single post
	alliance_skin_single_post_init();



	/* Load
	-----------------------------------------------------------------*/
	$window.on( 'load', function() {
		// Gutenberg
		alliance_skin_gutenberg_init();

		// Page blocks
		alliance_skin_page_content_blocks_init();
	});



	/* Ready
	-----------------------------------------------------------------*/
	$document.on( 'ready', function() {
		$window.trigger( 'resize' );
	});



	/* Resize
	-----------------------------------------------------------------*/
	$window.on( 'resize', function() {
		if ( !$body.hasClass('course-item-popup') ) {
			// Page width
			alliance_skin_body_width_init();
				
			// Header height
			alliance_skin_header_height_init();
				
			// Footer height
			alliance_skin_footer_height_init();
		}
		// Close menu side
		alliance_skin_menu_side_resize();
		
		// Fixed row position on mobile
		alliance_skin_fixed_row_mobile_init();

		// Search init
		alliance_skin_search_init();

		// Single post
		alliance_skin_single_post_init();

		if ( jQuery('.post_layout_excerpt').length > 0 ) {			
			setTimeout(function() {
				// Blog item height
				alliance_skin_blog_item_height_init();

				$window.trigger( 'scroll' );
			}, 100);
		}
	});



	/* Scroll
	-----------------------------------------------------------------*/
	$window.on( 'scroll', function() {
		// Fixed row position on mobile
		alliance_skin_fixed_row_mobile_init();
	});



	/* AJAX and hidden elements
	-----------------------------------------------------------------*/
	$document.on( 'action.init_hidden_elements', function() {
		// Page blocks
		alliance_skin_page_content_blocks_init();

		// Blog item height
		alliance_skin_blog_item_height_init();

		// Remove check
		alliance_skin_cf7_remove_check();

		// Audio
		if ( $body.hasClass('elementor-editor-active') ) {
			alliance_skin_audio_init();
		}
	});



	/* Elementor editor
	-----------------------------------------------------------------*/
	$window.on( 'elementor/frontend/init', function() {
		if ( typeof window.elementorFrontend !== 'undefined' && typeof window.elementorFrontend.hooks !== 'undefined' ) {
			// If Elementor is in the Editor's Preview mode
			if ( elementorFrontend.isEditMode() ) {
				// Init elements after creation
				elementorFrontend.hooks.addAction( 'frontend/element_ready/global', function( $cont ) {		
					// Page width
					alliance_skin_body_width_init();

					// Page blocks
					alliance_skin_page_content_blocks_init();

					// Radio & Checkbox
					alliance_skin_radio_checkbox_init();	

					// Blog item height
					alliance_skin_blog_item_height_init();

					// Audio
					alliance_skin_audio_init();
				});
			}
		}
	});



	// Return Gutenberg editor object
	function alliance_skin_gutenberg_editor_object() {
		// Get Post Editor
		var $editor = jQuery( '.edit-post-visual-editor:not(.alliance_inited2)' ).eq( 0 );
		if ( ! $editor.length ) {
			// Check if Full Site Editor exists
			var $editor_frame = jQuery( 'iframe[name="editor-canvas"]' );
			if ( $editor_frame.length ) {
				$editor_frame = jQuery( $editor_frame.get(0).contentDocument.body );
				if ( $editor_frame.hasClass('editor-styles-wrapper') && ! $editor_frame.hasClass('alliance_inited2') ) {
					$editor = $editor_frame;
				}
			} else {
				// Check if Widgets Editor exists
				$editor = jQuery( '.edit-widgets-block-editor:not(.alliance_inited2)' ).eq( 0 );
			}
		}
		return $editor;
	}

	// Gutenberg
	function alliance_skin_gutenberg_init() {
		// Get Gutenberg editor object
		var $editor = alliance_skin_gutenberg_editor_object();
		if ( ! $editor.length ) {
			return;
		}

		var old_GB = $editor.hasClass( 'editor-styles-wrapper' ) && $editor.hasClass( 'edit-post-visual-editor' ),
			styles_wrapper  = old_GB || $editor.hasClass( 'editor-styles-wrapper' )
								? $editor
								: $editor.find( '.editor-styles-wrapper' );

		styles_wrapper.addClass( 'page_content_' + ALLIANCE_STORAGE['page_content'] );
		styles_wrapper.find('.is-root-container').addClass('content');

		$editor.addClass('alliance_inited2');
	}

	// Page blocks
	function alliance_skin_page_content_blocks_init() {
		var content = jQuery('body.sidebar_show [class*="content_wrap"] > .content,\
							   body:not(.sidebar_show) .page_content_wrap > [class*="content_wrap"],\
							   .is-root-container');

		content.find('.widget_title, .widget_subtitle').each(function(){
			jQuery(this).parent('.widget').addClass('is_block');	
		});

		content.find('.slider_outer_pagination, .slider_outer_controls').each(function(){
			jQuery(this).parents('.sc_testimonials').addClass('is_block');	
		});

		content.find('.sc_item_title, .sc_item_button').each(function(){
			jQuery(this).parent().addClass('is_block');	
		});
	}

	// Side (mobile) menu
	function alliance_skin_menu_side_init() {
		if ( $body.hasClass('menu_side_present') ) {
			// Close menu side
			alliance_skin_menu_side_resize();

			// Menu side actions on the mouse enter
			$menu_mobile.find('.menu_mobile_nav_area').on( 'mouseenter', function() {	
				if ( !$menu_mobile.hasClass('is_opened') && !$menu_mobile.hasClass('is_hovered') ) {
					$menu_mobile.addClass('is_hovered');
				}	
			});				

			// Menu side actions on the mouse leave
			$menu_mobile.on( 'mouseleave', function() {	
				if ( !$menu_mobile.hasClass('is_opened') && $menu_mobile.hasClass('is_hovered') ) {
					$menu_mobile.removeClass('is_hovered');
				}								
			});

			// Menu side actions on the 'menu' button click
			$menu_mobile.find('.menu_mobile_close').on( 'click', function(e) {
				$menu_mobile.toggleClass('is_opened').removeClass('is_hovered');
				$body.toggleClass('menu_mobile_is_opened');
				
				$document.trigger( 'action.init_hidden_elements', [$body.eq(0)] );
				
				if ( $window.width() >= 1679 ) {
					setTimeout(function() {
						$window.trigger( 'resize' );
					}, 300);
				}
			});
		} else {			
			// Menu mobile actions on the 'menu' button click
			jQuery('.sc_layouts_menu_mobile_button a').on( 'click', function(e) {
				if ( $menu_mobile.hasClass('opened') ) {
					$menu_mobile.find('.menu_mobile_close').click();
				}
			});
		}
	}

	// Side (mobile) menu
	function alliance_skin_menu_side_resize() {
		if ( $body.hasClass('menu_side_present') ) {
			// Close menu side
			if ( $window.width() < 1679 ) {
				$menu_mobile.removeClass('is_opened').removeClass('is_hovered').addClass('inited');
				$body.removeClass('menu_mobile_is_opened');
			}
		}
	}

	// Posts order
	function alliance_skin_posts_order_init() {
		if ( jQuery('.posts_sorting').length > 0 ) {
			jQuery('.posts_sorting select[name="posts_order"]').on('change', function(){
				jQuery(this).parents().submit();
			})
		}
	}

	// Radio & Checkbox
	function alliance_skin_radio_checkbox_init() { 
		/* Radio */
		jQuery('label > input[type="radio"]').each(function() {
			var item = this;
			jQuery(item).parent().addClass('radio_label');
			alliance_skin_radio_checkbox_change(item);

			jQuery(item).change(function() {
				var name = jQuery(item).attr('name');
				jQuery('input[type="radio"][name="' + name + '"]').parent().removeClass('checked');
			    alliance_skin_radio_checkbox_change(item);
			});
		});

		/* Checkbox */
		jQuery('label > input[type="checkbox"]').each(function() {
			var item = this;
			jQuery(item).parent().addClass('checkbox_label');
			alliance_skin_radio_checkbox_change(item);

			jQuery(item).change(function() {
			    alliance_skin_radio_checkbox_change(item);
			});
		});
	}

	function alliance_skin_radio_checkbox_change(item) { 
		if ( item.checked ) {
	        jQuery(item).parent().addClass('checked');  
	    } else {
	        jQuery(item).parent().removeClass('checked');  
	    }
	}

	function alliance_skin_cf7_remove_check() {
		$body.find('.wpcf7:not(.check_inited)').each( function() {
			var $form = jQuery(this);

			$form
				.addClass('check_inited')
				.on('wpcf7:submit wpcf7submit', function(e, details) {
					if ( typeof e == 'object' && typeof e.detail == 'object' && typeof e.detail.status != 'undefined' ) {
						if ( e.detail.status !== 'validation_failed' ) {
							jQuery('label > input[type="checkbox"], label > input[type="radio"]' ).each(function() {
								jQuery(this).parent().removeClass('checked');
							});
						}
					}
				});
		});
	}

	// Page content
	function alliance_skin_content_switcher_init() {
		jQuery('#page_content_switcher').on('click', function(){
			$body.toggleClass('page_content_blocks').toggleClass('page_content_classic');

			$document.trigger( 'action.init_hidden_elements', [$body.eq(0)] );
			$window.trigger( 'resize' );
		});	
	}

	// Color switcher
	function alliance_skin_color_switcher_init() {
		if ( $color_switcher.length > 0 ) {
			// Change color scheme after page load
			var site_color_scheme = alliance_get_cookie('alliance_color_scheme');
			if ( site_color_scheme != null ) {		
				alliance_skin_remove_color_scheme_class();
				$body.addClass('scheme_' + site_color_scheme);
				$color_switcher.find('li[data-value="' + site_color_scheme + '"]').addClass('selected');
				alliance_skin_invert_logo_colors(site_color_scheme);
			}

			// Open color schemes
			$color_switcher.on('click', function(){
				jQuery(this).toggleClass('opened');
			});

			// Change color scheme on the button click
			$color_switcher.find('li').on('click', function() {
				var val = jQuery(this).attr('data-value');
				alliance_skin_remove_color_scheme_class();
				$body.addClass('scheme_' + val);
				$color_switcher.removeClass('opened');
				alliance_set_cookie( 'alliance_color_scheme', val, { expires: 365, path: '/' });
				alliance_skin_invert_logo_colors(val);
			});
		}
	}

	// Remove body color scheme class
	function alliance_skin_remove_color_scheme_class() {
		$color_switcher.find('li').each(function(){
			var val = jQuery(this).attr('data-value');
			$body.removeClass('scheme_' + val);
		});
	}

	// Invert logo colors
	function alliance_skin_invert_logo_colors(site_color_scheme) {
		if ( $color_switcher.hasClass('invert') ) {
			if ( site_color_scheme == 'dark') {
				jQuery('body.scheme_dark').find('header:not([class*="scheme_"]), .menu_mobile:not([class*="scheme_"]), footer:not([class*="scheme_"]), #trx_addons_login_popup').find('.logo_image, .sc_layouts_logo').addClass('invert');
			} else {
				jQuery('body.scheme_dark').find('header:not([class*="scheme_"]), .menu_mobile:not([class*="scheme_"]), footer:not([class*="scheme_"]), #trx_addons_login_popup').find('.logo_image, .sc_layouts_logo').removeClass('invert');
			}
		}
	}

	// Page width
	function alliance_skin_body_width_init() { 
		var cont = jQuery( 'body.menu_side_present,\
							body.menu_side_present.menu_side_left .sc_layouts_row_fixed,\
							body.menu_side_present .menu_mobile,\
							body.menu_side_present .menu_mobile .menu_mobile_top_panel,\
							body.menu_side_present .menu_mobile .menu_mobile_close,\
							body.menu_side_present .top_panel .elementor-section > .elementor-container,\
							body.menu_side_present .content_wrap,\
							body.menu_side_present .content_wrap > .content,\
							body.menu_side_present .content_wrap > .sidebar,\
							body.menu_side_present .content_container,\
							body.menu_side_present .content_container > .content,\
							body.menu_side_present .content_container > .sidebar');
		cont.addClass('no_anim');

		document.querySelector('html').style.setProperty( '--theme-var-body', $window.width() + 'px' );

		setTimeout(function() {
			cont.removeClass('no_anim');
		}, 100);
	}

	// Header height
	function alliance_skin_header_height_init() { 
		for( var i = 0; i < 3; i++ ) {
			setTimeout(function() {
				alliance_skin_header_height_resize();
			}, 50);
		}
	}

	function alliance_skin_header_height_resize() { 
		header_height = $header.length === 0 ? 0 : $header.outerHeight();
		if (header_height < 1) {
			header_height = $header.find('.sc_layouts_row_fixed').outerHeight();
		}
		document.querySelector('html').style.setProperty( '--theme-var-header', header_height + 'px' );

		// Calculate a fixed row height
		var fixed_placeholder = jQuery('body.menu_side_present .sc_layouts_row_fixed:not(.sc_layouts_row_hide_unfixed) + .sc_layouts_row_fixed_placeholder');
		var fixed_height = fixed_placeholder.length === 0 ? 0 : fixed_placeholder.prev().outerHeight();
		fixed_placeholder.height(fixed_height);  
	}

	// Footer height
	function alliance_skin_footer_height_init() { 
		footer_height = $footer.length === 0 ? 0 : $footer.outerHeight();
		document.querySelector('html').style.setProperty( '--theme-var-footer', footer_height + 'px' );
	}

	// Fixed row position on mobile
	function alliance_skin_fixed_row_mobile_init() {
		if ( $body.hasClass('menu_side_present') && jQuery('.top_panel').length > 0 && jQuery('.sc_layouts_row_fixed').length > 0 ) {
			if ( $body.hasClass('admin-bar') && $body.hasClass('mobile_layout') ) {
				if ( $body.width() > 600 ) { 
					jQuery('body.admin-bar .menu_mobile,\
							body.admin-bar .sc_layouts_row_fixed').css('transform', 'none');
				} else {
					var yOffset = $window.scrollTop(); 
					if ( yOffset > 46) {
						jQuery('body.admin-bar .menu_mobile,\
								body.admin-bar .sc_layouts_row_fixed').css('transform', 'translateY(0px)');
					} else {
						var off = 46 - yOffset;
						jQuery('body.admin-bar .menu_mobile,\
								body.admin-bar .sc_layouts_row_fixed').css('transform', 'translateY(' + off + 'px)');
					}
				}
			}
		}
	}

	// Blog item minimal height
	function alliance_skin_blog_item_height_init() {
		var masonry_array = [];

		jQuery('.masonry_wrap').each(function() {
			var wrap = jQuery(this);
			if ( wrap.find('.post_layout_excerpt.format-video, .post_layout_excerpt.format-audio').length > 0 ) {
				masonry_array.push(wrap);
			}
		});

		jQuery('.post_layout_excerpt.format-video, .post_layout_excerpt.format-audio').each(function() {
			var item = jQuery(this);

			alliance_when_images_loaded( item, function() {		
				item.find('.post_featured').css('min-height', 'unset');
				item.find('.post_featured > img').removeClass('cover_image');

				var item_height = Math.ceil(item.outerHeight());
				var info = item.find('.post_featured .post_info');
				var info_height = Math.ceil(info.outerHeight());

				if ( info_height > item_height ) {
					item.find('.post_featured').css('min-height', info_height + 'px');
					item.find('.post_featured > img').addClass('cover_image');
				}
			});		
		});

		setTimeout(function() {
			for( var i = 0; i < masonry_array.length; i++ ) {
				masonry_array[i].masonry(); 
			}
		}, 100);
	}

	// Audio
	function alliance_skin_audio_init() {
		jQuery('.audio_frame, .audio_wrap, .wp-widget-media_audio').each(function() {
			var audio = jQuery(this);
			var html = audio.html().replaceAll('mejs__', 'mejs-');
			audio.html(html);
		});
	}

	// Search init
	function alliance_skin_search_init() {
		if ( $window.width() < 1024 ) {
			jQuery('.search_field[data-mobile-placeholder]').each(function() {
				var search = jQuery(this);

				if ( !search.hasClass('mobile_placeholder') ) {
					var placeholder = search.attr('placeholder');
					search.attr('desc-placeholder', placeholder);

					var mobile_placeholder = search.attr('data-mobile-placeholder');
					search.attr('placeholder', mobile_placeholder);

					search.addClass('mobile_placeholder');
				}
			});
		} else {
			jQuery('.search_field[data-mobile-placeholder]').each(function() {
				var search = jQuery(this);

				if ( search.hasClass('mobile_placeholder') ) {
					var desc_placeholder = search.attr('desc-placeholder');
					search.attr('placeholder', desc_placeholder);

					search.removeClass('mobile_placeholder');
				}
			});
		}
	}

	// Single post
	function alliance_skin_single_post_init() {
		jQuery('.sidebar_show.single_style_style-1 .post_header_wrap .post_featured.post_featured_bg + .post_header').each(function() {
			var header = jQuery(this);
			var header_height = header.outerHeight();
			var featured = header.prev();
			featured.css('min-height', 'calc(' + header_height + 'px + 2 * ( var(--theme-var-grid_gap) + ( var(--theme-var-grid_gap_koef) * 15px )))');
		});
	}
})();/* global jQuery:false */
/* global ALLIANCE_STORAGE:false */

( function() {
	"use strict";

	var $window   = jQuery( window ),
		$document = jQuery( document ),
		$html = jQuery('html'),
		$body = jQuery('body');



	/* Init
	-----------------------------------------------------------------*/
	// BBPress and BuddyPress
	alliance_bbpress_init();

	// BuddyPress Docs
	alliance_bp_docs_init();

	// Knowledge Base
	alliance_epkb_init();

	// LearnDash LMS
	alliance_sfwd_lms_init();

	// LearnPress
	alliance_learnpress_init();

	// WP Job Manager
	alliance_job_manager_init();

	// Paid Memberships Pro
	alliance_memberships_init();

	// Elementor
	alliance_elementor_init();

	// WooCommerce
	alliance_woocommerce_init();



	/* Ready
	-----------------------------------------------------------------*/
	$document.on( 'action.ready_alliance', function() {
		// Process Tribe Events view after it was reloaded by AJAX
		jQuery('.tribe-events-view').on( 'beforeAjaxComplete.tribeEvents beforeAjaxSuccess.tribeEvents beforeAjaxError.tribeEvents', alliance_tribe_events_init );
	});



	/* Resize
	-----------------------------------------------------------------*/
	$window.on( 'resize', function() {
		// BBPress and BuddyPress
		alliance_bbpress_resize();
	});



	/* Elementor editor
	-----------------------------------------------------------------*/
	$window.on( 'elementor/frontend/init', function() {
		if ( typeof window.elementorFrontend !== 'undefined' && typeof window.elementorFrontend.hooks !== 'undefined' ) {
			// If Elementor is in the Editor's Preview mode
			if ( elementorFrontend.isEditMode() ) {
				// Init elements after creation
				elementorFrontend.hooks.addAction( 'frontend/element_ready/global', function( $cont ) {		
					// BBPress and BuddyPress
					alliance_bbpress_init();

					// BuddyPress Docs
					alliance_bp_docs_init();

					// Knowledge Base
					alliance_epkb_init();

					// LearnDash LMS
					alliance_sfwd_lms_init();

					// LearnPress
					alliance_learnpress_init();

					// WP Job Manager
					alliance_job_manager_init();

					// Paid Memberships Pro
					alliance_memberships_init();

					// Elementor
					alliance_elementor_init();
				});
			}
		}
	});



	/* Google Map
	-----------------------------------------------------------------*/
	// Add new style 'Extra' to the Google maps
	$document.on('action.add_googlemap_styles', function(e) {
		if (typeof TRX_ADDONS_STORAGE == 'undefined') return;
		TRX_ADDONS_STORAGE['googlemap_styles']['extra'] = [{"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#e9e9e9"}, {"lightness": 17}]}, {"featureType": "landscape", "elementType": "geometry", "stylers": [{"color": "#f5f5f5"}, {"lightness": 20}]}, {"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#ffffff"}, {"lightness": 17}]}, {"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#ffffff"}, {"lightness": 29}, {"weight": 0.2}]}, {"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"color": "#ffffff"}, {"lightness": 18}]}, {"featureType": "road.local", "elementType": "geometry", "stylers": [{"color": "#ffffff"}, {"lightness": 16}]}, {"featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#f5f5f5"}, {"lightness": 21}]}, {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#dedede"}, {"lightness": 21}]}, {"elementType": "labels.text.stroke", "stylers": [{"visibility": "on"}, {"color": "#ffffff"}, {"lightness": 16}]}, {"elementType": "labels.text.fill", "stylers": [{"saturation": 36}, {"color": "#333333"}, {"lightness": 40}]}, {"elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {"featureType": "transit", "elementType": "geometry", "stylers": [{"color": "#f2f2f2"}, {"lightness": 19}]}, {"featureType": "administrative", "elementType": "geometry.fill", "stylers": [{"color": "#fefefe"}, {"lightness": 20}]}, {"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{"color": "#fefefe"}, {"lightness": 17}, {"weight": 1.2}]}];
	} );
	


	// BBPress and BuddyPress 
	function alliance_bbpress_init() {
		// Widget Topics
		jQuery('.widget_display_topics,\
			.wp-widget-bbp_topics_widget').find('.bbp-author-avatar').parents('.widget').addClass('with_author');

		// Widget Recent Activity
		jQuery('.widget_bp_core_recently_active_widget,\
			.wp-widget-bp_core_recently_active_widget').find('.widget_title .sc_button_wrap').each(function(){
			var btn = jQuery(this);
			if ( btn.parents('.widget').find('.avatar-block').length > 0 ) {
				btn.insertAfter(btn.parents('.widget').find('.avatar-block'));
			} else {
				btn.insertAfter(btn.parents('.widget').find('.widget-error'));
			}
		});

		// Widget Members
		jQuery('.widget.widget_bp_core_members_widget,\
			.wp-widget-bp_core_members_widget').find('.widget_title .sc_button_wrap').each(function(){
			var btn = jQuery(this);
			btn.insertAfter(btn.parents('.widget').find('.item-list'));
		});

		// Widget Groups
		jQuery('.widget.widget_bp_groups_widget,\
			.wp-widget-bp_groups_widget').find('.widget_title .sc_button_wrap').each(function(){
			var btn = jQuery(this);
			btn.insertAfter(btn.parents('.widget').find('.item-list'));
		});

		// Widget Docs
		jQuery('.widget.widget_recent_bp_docs,\
			.wp-widget-widget_recent_bp_docs').find('.widget_title .sc_button_wrap').each(function(){
			var btn = jQuery(this);
			btn.insertAfter(btn.parents('.widget').find('ul'));
		});

		// Profile header
		jQuery('#item-header-content').each(function(){
			var header = jQuery(this).append('<div class="user-meta"></div>');
			header.find('.user-nicename').appendTo(header.find('.user-meta'));
			header.find('.highlight').appendTo(header.find('.user-meta'));
			header.find('.activity').appendTo(header.find('.user-meta'));

			// Group
			header.next('#item-actions').prependTo(header);
		});

		// Activity comments
		jQuery('.activity-item .activity-comments ul li').each(function(){
			jQuery(this).parents('.activity-item').addClass('has-comments')
		});

		// New Post form
		jQuery('#subnav + #whats-new-form').each(function(){
			var form = jQuery(this);
			form.insertBefore(form.prev());
		});

		// Activity load more
		jQuery('div.bpas-shortcode-activities').on('click', 'li.load-more', function() {
			setTimeout(function(){
				$document.trigger( 'action.init_hidden_elements', [$body.eq(0)] );
				$window.trigger( 'resize' );
			}, 3000);
	    }); 

		// Members buttons
		jQuery('#members-list > li .action .generic-button a').each(function(){
			var btn = jQuery(this);
			btn.attr('data-title', btn.text());
		});

		// Forums buttons
		jQuery('#subscription-toggle').each(function(){
			var btn = jQuery(this);
			var txt = btn.html().replace('&nbsp;|&nbsp;', '');
			btn.html(txt);
		});

		// Register & Login
		jQuery('#signup_form .error').each(function(){
			var error = jQuery(this);
			error.insertAfter(error.next().addClass('not-valid'));
		});
	}

	// BuddyPress Docs
	function alliance_bp_docs_init() {
		// Table wrap
		jQuery('.doctable').each(function(){
			jQuery(this).wrap('<div class="doctable_wrap"><div class="doctable_wrap_inner"></div></div>');
		});

		// Messages
		jQuery('.bp-template-notice + .doc-content').each(function(){
			jQuery(this).prev().prependTo(jQuery(this));
		});

		// Messages
		jQuery('.bp-docs .doc-meta').each(function(){
			var meta = jQuery(this);
			if ( meta.text().length == 4 ) {
				meta.hide();
			}
		});
	}

	// Knowledge Base
	function alliance_epkb_init() {
		// Remove all inline styles
		jQuery('.eckb-kb-template, .eckb-kb-template *').each(function(){
			jQuery(this).removeAttr('style');

			jQuery('.eckb-kb-template').css('opacity', 1);
		});
	}

	// LearnDash LMS
	function alliance_sfwd_lms_init() {
		jQuery('.post_content_title + .learndash-wrap #ld_categorydropdown,\
			.post_content_title + .learndash-wrap #ld_course_categorydropdown').each(function(){
			var drop = jQuery(this);
			drop.addClass('inside_title');
			drop.appendTo(drop.parent().prev().addClass('with_category'));
		});

		jQuery('.ld-content .ld-course-status').attr('id', 'ld-course-status');
	}

	// LearnPress
	function alliance_learnpress_init() {
		// Disable page scroll at lesson/quiz post type(LearnPress)
		if( jQuery('body').hasClass('course-item-lp_lesson') || jQuery('body').hasClass('course-item-lp_quiz') ) {
			jQuery('html').addClass('overflow-y-hidden');
		}

		// Wrap LearPress tables with .lp-responsive-table
		if (jQuery('#learn-press-profile .lp-list-table').length > 0) {
			jQuery('#learn-press-profile .lp-list-table').wrap( '<div class="lp-responsive-table"></div>' );
		}

		// LearPress course progress
		if (jQuery('.curriculum-sections .learn-press-progress').length > 0) {
			jQuery('.curriculum-sections .learn-press-progress').each(function () {
				const $progress = jQuery(this);
				const $active = $progress.find('.learn-press-progress__active');
				const value = $active.data('value');

				if (value === undefined) {
					return;
				}

				$active.css('left', -(100 - parseInt(value)) + '%');
			});
		}
	}

	// WP Job Manager
	function alliance_job_manager_init() {
		jQuery('.search_jobs input[type="submit"]').each(function(){
			var btn = jQuery(this);
			var txt = btn.attr('value').replace( 'Jobs', '' );
			btn.attr('value', txt);
		});

		jQuery('#submit-resume-form input[type="submit"], #resume_preview input[type="submit"]').each(function(){
			var btn = jQuery(this);
			var txt = btn.attr('value').replace( ' →', '' ).replace( '← ', '' );
			btn.attr('value', txt);
		});
	}

	// Paid Memberships Pro
	function alliance_memberships_init() {
		jQuery('.pmpro_actionlinks').each(function(){
			var links = jQuery(this);
			var html = links.html().replaceAll( '|', '' );
			links.html(html);
		});
		jQuery('.pmpro_table').each(function(){
			jQuery(this).wrap('<div class="pmpro_table_wrap"></div>');
		});
	}

	// Elementor
	function alliance_elementor_init() {
		jQuery('.elementor-inner-section .elementor-widget').addClass('elementor-inner');
	}	

	// WooCommerce
	function alliance_woocommerce_init() {
		jQuery('.rating_details_table_cell_total').each(function(){
			var width = jQuery(this).html();
			jQuery(this).prev().find('[class*="rating_details_table_cell_bar_fill_"]').width(width);

		});
	}	

	// Tribe events
	function alliance_tribe_events_init( jqXHR, textStatus ) {
		setTimeout( function() {
			// Set up event handler again because .tribe-events-view was recreated after AJAX
			jQuery('.tribe-events-view').on( 'beforeAjaxComplete.tribeEvents beforeAjaxSuccess.tribeEvents beforeAjaxError.tribeEvents', alliance_tribe_events_init );
			// ToDo: Any actions after the Tribe Events View is reloaded
		}, 10 );
	}	

	// BBPress and BuddyPress
	function alliance_bbpress_resize() {
		if ( $window.width() <= 1679 ) {
			jQuery('#cover-image-container').addClass('scheme_dark');
		} else {
			jQuery('#cover-image-container').removeClass('scheme_dark');
		}
	}
})();// Buttons decoration (add 'hover' class)
// Attention! Not use cont.find('selector')! Use jQuery('selector') instead!

jQuery( document ).on(
	'action.init_hidden_elements', function(e, cont) {
		"use strict";

		// Add button's hover class (selected in Theme Options) to the tags 'button' and 'a'
		// 'sc_button_hover_fade' | 'sc_button_hover_slide_left' | 'sc_button_hover_slide_right' | 'sc_button_hover_slide_top' | 'sc_button_hover_slide_bottom'
		if (ALLIANCE_STORAGE['button_hover'] && ALLIANCE_STORAGE['button_hover'] != 'default') {
			jQuery(
				// Tag 'button'
				'button:not(.search_submit):not(.full_post_close):not([class*="sc_button_hover_"]),'
				+ '.sc_form_field button:not([class*="sc_button_hover_"]),'
				// Theme and sc_button
				+ '.theme_button:not([class*="sc_button_hover_"]),'
				+ '.sc_button:not([class*="sc_button_simple"]):not([class*="sc_button_bordered"]):not([class*="sc_button_hover_"]),'
				// Theme tabs
				+ '.alliance_tabs .alliance_tabs_titles li a:not([class*="sc_button_hover_"]),'
				// More link
				+ '.post_item .more-link:not([class*="sc_button_hover_"]),'
				// Links in the trx_addons hover with back info
				+ '.trx_addons_hover_content .trx_addons_hover_links a:not([class*="sc_button_hover_"]),'
				// BuddyPress
				+ '#buddypress a.button:not([class*="sc_button_hover_"])'
				// MP Time table
				+ '.mptt-navigation-tabs li a:not([class*="sc_button_hover_style_"]),'
				// EDD (Easy digital downloads)
				+ '.edd_download_purchase_form .button:not([class*="sc_button_hover_style_"]),'
				+ '.edd-submit.button:not([class*="sc_button_hover_style_"]),'
				+ '.widget_edd_cart_widget .edd_checkout a:not([class*="sc_button_hover_style_"]),'
				// WooCommerce
				+ '.hover_shop_buttons .icons a:not([class*="sc_button_hover_style_"]),'
				+ '.woocommerce #respond input#submit:not([class*="sc_button_hover_"]),'
				+ '.woocommerce .button:not([class*="shop_"]):not([class*="view"]):not([class*="sc_button_hover_"]),'
				+ '.woocommerce-page .button:not([class*="shop_"]):not([class*="view"]):not([class*="sc_button_hover_"])'
			).addClass( 'sc_button_hover_just_init sc_button_hover_' + ALLIANCE_STORAGE['button_hover'] );

			// Add button's hover class if not based on :before or :after elements (like 'sc_button_hover_arrow')
			if (ALLIANCE_STORAGE['button_hover'] != 'arrow') {
				jQuery(
					// Form buttons
					'input[type="submit"]:not([class*="sc_button_hover_"]),'
					+ 'input[type="button"]:not([class*="sc_button_hover_"]),'
					// VC tabs and accordion
					+ '.vc_tta-accordion .vc_tta-panel-heading .vc_tta-controls-icon:not([class*="sc_button_hover_"]),'
					+ '.vc_tta-color-grey.vc_tta-style-classic .vc_tta-tab > a:not([class*="sc_button_hover_"]),'
					// Tribe Events Calendar
					+ '.tribe-events-button:not([class*="sc_button_hover_"]),'
					+ '#tribe-bar-views .tribe-bar-views-list .tribe-bar-views-option a:not([class*="sc_button_hover_"]),'
					+ '.tribe-bar-mini #tribe-bar-views .tribe-bar-views-list .tribe-bar-views-option a:not([class*="sc_button_hover_"]),'
					+ '.tribe-events-cal-links a:not([class*="sc_button_hover_"]),'
					+ '.tribe-events-sub-nav li a:not([class*="sc_button_hover_"]),'
					// ThemeREX Addons buttons
					+ '.isotope_filters_button:not([class*="sc_button_hover_"]),'
					+ '.trx_addons_scroll_to_top:not([class*="sc_button_hover_"]),'
					+ '.sc_promo_modern .sc_promo_link2:not([class*="sc_button_hover_"]),'
					+ '.slider_container .slider_prev:not([class*="sc_button_hover_"]),'
					+ '.slider_container .slider_next:not([class*="sc_button_hover_"]),'
					+ '.sc_slider_controller_titles .slider_controls_wrap > a:not([class*="sc_button_hover_"])'
				).addClass( 'sc_button_hover_just_init sc_button_hover_' + ALLIANCE_STORAGE['button_hover'] );
			}

			// Alter style: sc_button_hover_style_default
			jQuery(
				// Controls in the slider controller (style 'Titles') - arrows at the left and right side
				'.sc_slider_controller_titles .slider_controls_wrap > a:not([class*="sc_button_hover_style_"])'
			).addClass( 'sc_button_hover_just_init sc_button_hover_style_default' );

			// Alter style: sc_button_hover_style_inverse
			jQuery(
				// Links in the trx_addons hover with back info
				'.trx_addons_hover_content .trx_addons_hover_links a:not([class*="sc_button_hover_style_"]),'
				// WooCommerce single product: related products and up-sells
				+ '.single-product ul.products li.product .post_data .button:not([class*="sc_button_hover_style_"])'
			).addClass( 'sc_button_hover_just_init sc_button_hover_style_inverse' );

			// Alter style: sc_button_hover_style_hover
			jQuery(
				// Social share icons
				'.post_item_single .post_content .post_meta .post_share .socials_type_block .social_item .social_icon:not([class*="sc_button_hover_style_"]),'
				// WooCommerce buttons with class 'alt'
				+ '.woocommerce #respond input#submit.alt:not([class*="sc_button_hover_style_"]),'
				+ '.woocommerce a.button.alt:not([class*="sc_button_hover_style_"]),'
				+ '.woocommerce button.button.alt:not([class*="sc_button_hover_style_"]),'
				+ '.woocommerce input.button.alt:not([class*="sc_button_hover_style_"])'
			).addClass( 'sc_button_hover_just_init sc_button_hover_style_hover' );

			// Alter style: sc_button_hover_style_alter
			jQuery(
				// WooCommerce buttons in the notice and info areas
				'.woocommerce .woocommerce-message .button:not([class*="sc_button_hover_style_"]),'
				+ '.woocommerce .woocommerce-info .button:not([class*="sc_button_hover_style_"])'
			).addClass( 'sc_button_hover_just_init sc_button_hover_style_alter' );

			// Alter style: sc_button_hover_style_alterbd
			jQuery(
				// ThemeREX Addons tabs in the sidebar
				'.sidebar .trx_addons_tabs .trx_addons_tabs_titles li a:not([class*="sc_button_hover_style_"]),'
				// Theme tabs
				+ '.alliance_tabs .alliance_tabs_titles li a:not([class*="sc_button_hover_style_"])'
			).addClass( 'sc_button_hover_just_init sc_button_hover_style_alterbd' );

			// Alter style: sc_button_hover_style_dark
			jQuery(
				// VC tabs and accordion
				'.vc_tta-accordion .vc_tta-panel-heading .vc_tta-controls-icon:not([class*="sc_button_hover_style_"]),'
				+ '.vc_tta-color-grey.vc_tta-style-classic .vc_tta-tab > a:not([class*="sc_button_hover_style_"]),'
				// WooCommerce tabs in the single product
				+ '.single-product div.product > .woocommerce-tabs .wc-tabs li a:not([class*="sc_button_hover_style_"]),'
				// sc_button with color style 'dark'
				+ '.sc_button.color_style_dark:not([class*="sc_button_simple"]):not([class*="sc_button_hover_style_"]),'
				// Slider controls (arrows)
				+ '.slider_prev:not([class*="sc_button_hover_style_"]),'
				+ '.slider_next:not([class*="sc_button_hover_style_"]),'
				// Video player - button 'Play'
				+ '.trx_addons_video_player.with_cover .video_hover:not([class*="sc_button_hover_style_"]),'
				// ThemeREX Addons tabs
				+ '.trx_addons_tabs .trx_addons_tabs_titles li a:not([class*="sc_button_hover_style_"])'
			).addClass( 'sc_button_hover_just_init sc_button_hover_style_dark' );

			// Alter style: sc_button_hover_style_extra
			jQuery(
				// Price table links
				'.sc_price_item_link:not([class*="sc_button_hover_style_"])'
			).addClass( 'sc_button_hover_just_init sc_button_hover_style_extra' );

			// Alter style: sc_button_hover_style_link2
			jQuery(
				// sc_button with color style 'link2'
				'.sc_button.color_style_link2:not([class*="sc_button_simple"]):not([class*="sc_button_hover_style_"])'
			).addClass( 'sc_button_hover_just_init sc_button_hover_style_link2' );

			// Alter style: sc_button_hover_style_link3
			jQuery(
				// sc_button with color style 'link3'
				'.sc_button.color_style_link3:not([class*="sc_button_simple"]):not([class*="sc_button_hover_style_"])'
			).addClass( 'sc_button_hover_just_init sc_button_hover_style_link3' );

			// Remove hover class from some elements for which hover-effect should not be used
			jQuery(
				// Media player 'Media elements'
				'.mejs-controls button,'
				// Magnific popup close button
				+ '.mfp-close,'
				// sc_button with background image
				+ '.sc_button_bg_image,'
				// Buttons inside maps
				+ '.sc_googlemap button,'
				+ '.sc_osmap button,'
				// Buttons in rows with type 'Narrow' inside custom layouts
				+ '.sc_layouts_row_type_narrow .sc_button,'
				// Tribe Events 5.0+ new design
				+ '.tribe-common-c-btn-icon,'
				+ '.tribe-events-c-top-bar__datepicker-button,'
				+ '.tribe-events-calendar-list-nav button,'
				+ '.tribe-events-cal-links .tribe-events-button,'
				// Links in the hover 'Shop'
				+ '.hover_shop_buttons a,'
				// Woocommerce
				+ 'button.pswp__button,'
				+ '.woocommerce-orders-table__cell-order-actions .button'
			).removeClass( 'sc_button_hover_' + ALLIANCE_STORAGE['button_hover'] );

			// Remove temporary class 'sc_button_hover_just_init'
			setTimeout(
				function() {
					jQuery( '.sc_button_hover_just_init' ).removeClass( 'sc_button_hover_just_init' );
				}, 500
			);

		}

	}
);
