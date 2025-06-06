export class MongoTokens {
    public static getOptions(): string {
        return String('mongodb_module_options');
    }

    public static getClient(): string {
        return String('mongodb_module_client');
    }

    public static getDatabase(): string {
        return String('mongodb_module_database');
    }

    public static getCollection(collection: string): string {
        const description = collection.trim().toLowerCase();
        return String(`mongodb_module_collection_${description}`);
    }
}
