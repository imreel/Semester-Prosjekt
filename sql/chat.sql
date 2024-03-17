CREATE TABLE chat
(
    id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sender     integer,
    receiver   integer,
    text       text,
    created_at timestamp
);

