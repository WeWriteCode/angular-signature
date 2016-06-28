/*
 * https://github.com/legalthings/signature-pad-angular
 * Copyright (c) 2015 ; Licensed MIT
 */

/*
 * Forked:
 * https://github.com/WeWriteCode/angular-signature
 * Copyright (c) 2016 ; Licensed MIT
 */

angular.module('signature', []);

angular.module('signature').directive('signaturePad', ['$window',
  function ($window) {
    'use strict';

    var canvas, EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
    return {
      restrict: 'EA',
      replace: true,
      template: '<canvas class="signature-canvas" data-ng-mouseup="updateModel()"></canvas>',
      scope: {
        accept: '=',
        clear: '=',
        dataurl: '=',
        signaturePadOptions: '=',
        class: '@'
      },
      controller: [
        '$scope',
        function ($scope) {
          $scope.accept = function () {
            var signature = {};

            if (!$scope.signaturePad.isEmpty()) {
              signature.dataUrl = $scope.signaturePad.toDataURL();
              signature.isEmpty = false;
            } else {
              signature.dataUrl = EMPTY_IMAGE;
              signature.isEmpty = true;
            }

            return signature;
          };

          $scope.updateModel = function () {
            var result = $scope.accept();
            $scope.dataurl = result.isEmpty ? undefined : result.dataUrl;
          };

          $scope.clear = function () {
            $scope.signaturePad.clear();
            $scope.dataurl = undefined;
          };

          $scope.$watch("dataurl", function (dataUrl) {
            if (dataUrl) {
              $scope.signaturePad.fromDataURL(dataUrl);
            }
          });
        }
      ],
      link: function (scope, element) {
        var canvas = element[0];
        scope.signaturePadOptions = scope.signaturePadOptions || {};
        scope.signaturePad = new SignaturePad(canvas, scope.signaturePadOptions);

        if (scope.signature && !scope.signature.$isEmpty && scope.signature.dataUrl) {
          scope.signaturePad.fromDataURL(scope.signature.dataUrl);
        }

        scope.onResize = function() {
          var ratio =  Math.max($window.devicePixelRatio || 1, 1);
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          canvas.getContext("2d").scale(ratio, ratio);
        };

        scope.onResize();

        angular.element($window).bind('resize', function() {
            scope.onResize();
        });
      }
    };
  }
]);
