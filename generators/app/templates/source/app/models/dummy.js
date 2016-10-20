
'use strict';

angular
	// as a deep for root module
	.module('<%=app%>')
	// Model injector name
	.factory('<%=name%>', function () {
		// privat methods of model
		function valid (  ) {

		}

		/**
		 * 
		 *
		 * @param: { Object } - inherit data
		 * @constructor
		 */
		function <%=name%> ( data ) {

			angular.extend(this, data);

		}

		<%=name%>.prototype = {
			constructor: <%=name%>,
			// publick methods of model


		};

		return <%=name%>;
	});