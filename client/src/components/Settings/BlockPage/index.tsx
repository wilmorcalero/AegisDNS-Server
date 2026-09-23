import React, { useState, useEffect } from 'react';

interface BlockPageConfig {
    title: string;
    subtitle: string;
    contactInfo: string;
    showIp: boolean;
    showDomain: boolean;
    shieldColor: string;
    customMessage: string;
}

const DEFAULT_CONFIG: BlockPageConfig = {
    title: 'Acceso Restringido por AegisDNS Shield',
    subtitle: 'Este sitio web ha sido bloqueado de acuerdo con las políticas de seguridad de la red.',
    contactInfo: 'soporte@aegisdns.local',
    showIp: true,
    showDomain: true,
    shieldColor: '#00e5ff',
    customMessage: 'Si consideras que este bloqueo es un error, por favor ponte en contacto con el administrador.',
};

const BlockPageEditor: React.FC = () => {
    const [config, setConfig] = useState<BlockPageConfig>(() => {
        const saved = localStorage.getItem('aegis_block_page_config');
        return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    });
    const [savedNotice, setSavedNotice] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('aegis_block_page_config', JSON.stringify(config));
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3500);
    };

    return (
        <div className="row">
            <div className="col-12 mb-3">
                <h1 className="page-title">Personalización de Pantalla de Bloqueo (AegisDNS)</h1>
                <div className="text-muted">
                    Modifica los mensajes, colores y avisos que verán los usuarios de tu red cuando intenten acceder a sitios bloqueados o para adultos.
                </div>
            </div>

            {/* Formulario de Configuración */}
            <div className="col-lg-6 col-12">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Configuración de Plantilla</h3>
                    </div>
                    <div className="card-body">
                        {savedNotice && (
                            <div className="alert alert-success">
                                <strong>¡Éxito!</strong> Configuración de pantalla guardada correctamente.
                            </div>
                        )}
                        <form onSubmit={handleSave}>
                            <div className="form-group mb-3">
                                <label className="form-label font-weight-bold">Título de la Alerta</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={config.title}
                                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label font-weight-bold">Subtítulo / Razón del Bloqueo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={config.subtitle}
                                    onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label font-weight-bold">Mensaje Adicional</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={config.customMessage}
                                    onChange={(e) => setConfig({ ...config, customMessage: e.target.value })}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label font-weight-bold">Email o Teléfono de Soporte</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={config.contactInfo}
                                    onChange={(e) => setConfig({ ...config, contactInfo: e.target.value })}
                                />
                            </div>

                            <div className="row mb-3">
                                <div className="col-6">
                                    <label className="form-label font-weight-bold">Color del Escudo</label>
                                    <input
                                        type="color"
                                        className="form-control form-control-color"
                                        value={config.shieldColor}
                                        onChange={(e) => setConfig({ ...config, shieldColor: e.target.value })}
                                        style={{ height: '42px', width: '100%' }}
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="form-label font-weight-bold">Elementos Visibles</label>
                                    <div className="form-check mt-1">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="checkDomain"
                                            checked={config.showDomain}
                                            onChange={(e) => setConfig({ ...config, showDomain: e.target.checked })}
                                        />
                                        <label className="form-check-label" htmlFor="checkDomain">Mostrar Dominio</label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="checkIp"
                                            checked={config.showIp}
                                            onChange={(e) => setConfig({ ...config, showIp: e.target.checked })}
                                        />
                                        <label className="form-check-label" htmlFor="checkIp">Mostrar IP del Cliente</label>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 mt-2">
                                Guardar Plantilla de Bloqueo
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Vista Previa en Vivo (Live Preview) */}
            <div className="col-lg-6 col-12">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h3 className="card-title">Vista Previa en Vivo (Lo que verá el usuario)</h3>
                        <span className="badge bg-primary text-white">Live Preview</span>
                    </div>
                    <div className="card-body p-4" style={{ backgroundColor: '#0b0f19', borderRadius: '0 0 8px 8px', minHeight: '440px' }}>
                        <div className="text-center py-4">
                            {/* Escudo SVG de AegisDNS con color dinámico */}
                            <svg width="74" height="74" viewBox="0 0 24 24" fill="none" stroke={config.shieldColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 16px ${config.shieldColor})`, margin: '0 auto 18px auto' }}>
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>

                            <h2 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.4rem', marginBottom: '8px' }}>
                                {config.title || 'Acceso Restringido'}
                            </h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 20px auto' }}>
                                {config.subtitle}
                            </p>

                            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '14px', maxWidth: '400px', margin: '0 auto 18px auto', textAlign: 'left', fontSize: '0.86rem' }}>
                                {config.showDomain && (
                                    <div className="d-flex justify-content-between mb-1">
                                        <span style={{ color: '#64748b' }}>Sitio bloqueado:</span>
                                        <span style={{ color: '#f87171', fontWeight: 600 }}>ejemplo-bloqueado.com</span>
                                    </div>
                                )}
                                {config.showIp && (
                                    <div className="d-flex justify-content-between mb-1">
                                        <span style={{ color: '#64748b' }}>Tu dirección IP:</span>
                                        <span style={{ color: '#e2e8f0' }}>192.168.40.105</span>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between">
                                    <span style={{ color: '#64748b' }}>Filtrado por:</span>
                                    <span style={{ color: config.shieldColor, fontWeight: 600 }}>AegisDNS Engine v1.0</span>
                                </div>
                            </div>

                            <p style={{ color: '#64748b', fontSize: '0.82rem', maxWidth: '380px', margin: '0 auto 10px auto' }}>
                                {config.customMessage}
                            </p>
                            {config.contactInfo && (
                                <p style={{ color: config.shieldColor, fontSize: '0.82rem', fontWeight: 600 }}>
                                    Contacto: {config.contactInfo}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlockPageEditor;
