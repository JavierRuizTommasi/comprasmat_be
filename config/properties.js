// module.exports = {
//     PORT: process.env.PORT || 8080,
//     DB: 'mongodb+srv://apiUser:compras8585@cluster0.gqjxv.mongodb.net/prod?retryWrites=true&w=majority',
//     CHECK_NEWTENDER: 300000,
//     CHECK_1HORA: 3600000,
//     URLAPI: 'https://proagrocompras.herokuapp.com/api/',
//     URLHOME: 'http://proveedores.cf'
//
// }
const CLAUDE_HAIKU_4_5_ENABLED = (process.env.CLAUDE_HAIKU_4_5_ENABLED === 'true');

// If AVAILABLE_MODELS env var is provided, it should be a comma-separated list.
const envAvailableModels = process.env.AVAILABLE_MODELS ? process.env.AVAILABLE_MODELS.split(',').map(s => s.trim()).filter(Boolean) : [];

// Build final available models list. Include Claude Haiku 4.5 if flag enabled.
const AVAILABLE_MODELS = (() => {
    const base = envAvailableModels.slice();
    if (CLAUDE_HAIKU_4_5_ENABLED && !base.includes('claude-haiku-4.5')) {
        base.push('claude-haiku-4.5');
    }
    return base;
})();

module.exports = {
    PORT: process.env.PORT || 8080,
    DB: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/prod',
    DBLogs: process.env.DATABASE_LOGS || 'logsProd',
    CHECK_NEWTENDER: process.env.CHECK_NEWTENDER || 30000, // 30 seconds
    CHECK_1HORA: process.env.CHECK_1HORA || 3600000, // 1 hour
    URLAPI: process.env.URLAPI || 'http://localhost:8080/api/',
    URLHOME: process.env.URLHOME || 'http://localhost:4200',

    // Claude Haiku 4.5 feature flag
    CLAUDE_HAIKU_4_5_ENABLED: CLAUDE_HAIKU_4_5_ENABLED,
    // List of available model ids (array of strings)
    AVAILABLE_MODELS: AVAILABLE_MODELS
}

// Note: use the environment variable CLAUDE_HAIKU_4_5_ENABLED=true to enable Claude Haiku 4.5
// or set AVAILABLE_MODELS to a comma-separated list of model ids (e.g. "claude-haiku-4.5,gpt-4o").