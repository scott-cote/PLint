
unit_type -> procedure [token_slash];

procedure -> token_keyword_create [token_keyword_or token_keyword_replace]
 token_keyword_procedure token_identifier {token_keyword_is | token_keyword_as}
 token_keyword_begin procedure_statements token_keyword_end [token_identifier];

procedure_statements -> [procedure_statements] procedure_statement;

procedure_statement -> [token_identifier token_period] token_identifier
 token_left_paren [token_string] token_right_paren token_semicolon;
