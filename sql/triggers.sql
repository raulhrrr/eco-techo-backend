/* TRIGGERS */
CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $ $ BEGIN NEW."updatedAt" = NOW();

RETURN NEW;

END;

$ $ LANGUAGE 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE
UPDATE
    ON "tblUsers" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();