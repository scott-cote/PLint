#!/usr/bin/env node

'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _tokenizer = require('tokenizer');

var _tokenizer2 = _interopRequireDefault(_tokenizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var keywords = ['CREATE', 'OR', 'PROCEDURE', 'REPLACE'];

var createTokenizer = function createTokenizer() {

  var parse = true;

  var translateToken = function translateToken(token, match) {
    if (match.type === 'TOKEN_IDENTIFIER' && keywords.find(function (keyword) {
      return keyword === token.toUpperCase();
    })) {
      return 'TOKEN_KEYWORD_' + token.toUpperCase();
    }
  };

  var tokenizer = new _tokenizer2.default(translateToken);

  tokenizer.addRule(/^(\s)+$/, 'TOKEN_WHITESPACE');
  tokenizer.addRule(/^\w+$/, 'TOKEN_IDENTIFIER');
  tokenizer.addRule(/^;$/, 'TOKEN_SEMICOLON');
  tokenizer.addRule(/^\.$/, 'TOKEN_PERIOD');
  tokenizer.addRule(/^\($/, 'TOKEN_LEFT_PAREN');
  tokenizer.addRule(/^\)$/, 'TOKEN_RIGHT_PAREN');
  tokenizer.addRule(/^\/$/, 'TOKEN_EOF');
  tokenizer.addRule(/^'(?:[^']|'')*'$/, 'TOKEN_STRING');
  tokenizer.addRule(/^'(?:[^']|'')*$/, 'TOKEN_STRING_PARTIAL');

  tokenizer.ignore('TOKEN_WHITESPACE');

  var processToken = function processToken(token, type) {
    if (!parse) return;
    if (type === 'TOKEN_EOF') {
      tokenizer.addRule(/^.*$/, 'TOKEN_WHITESPACE');
      parse = false;
    }
    console.log(token.type);
  };

  tokenizer.on('token', processToken);
  tokenizer.on('end', function () {
    return processToken('/', 'TOKEN_EOF');
  });

  return tokenizer;
};

var argv = (0, _minimist2.default)(process.argv.slice(2));

var filecount = 0;

argv._.forEach(function (filename) {
  _fs2.default.createReadStream(filename).pipe(createTokenizer());
  filecount++;
});

console.log(filecount + ' files checked');