import fs from 'fs';
import minimist from 'minimist';
import Tokenizer from 'tokenizer';

let keywords = ['CREATE', 'OR', 'PROCEDURE', 'REPLACE'];

let createTokenizer = function() {

  let parse = true;

  let translateToken = function(token, match) {
    if (match.type === 'TOKEN_IDENTIFIER' &&
        keywords.find(keyword => keyword === token.toUpperCase())) {
      return 'TOKEN_KEYWORD_'+token.toUpperCase();
    }
  };

  let tokenizer = new Tokenizer(translateToken);

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

  let processToken = function(token, type) {
    if (!parse) return;
    if (type === 'TOKEN_EOF') {
      tokenizer.addRule(/^.*$/, 'TOKEN_WHITESPACE');
      parse = false;
    }
    console.log(token.type);
  };

  tokenizer.on('token', processToken);
  tokenizer.on('end', () => processToken('/','TOKEN_EOF'));

  return tokenizer;
};

let argv = minimist(process.argv.slice(2));

let filecount = 0;

argv._.forEach(filename => {
  fs.createReadStream(filename).pipe(createTokenizer());
  filecount++
});

console.log(filecount+' files checked');
