CREATE TABLE links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_url VARCHAR(255) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    user_id UUID NOT NULL,

    CONSTRAINT fk_links_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);
