import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { ServiceField } from './ServiceField';

export type BlockedService = {
    id: string;
    name: string;
    icon_svg: string;
    group_id: string;
};

export type ServiceGroups = {
    id: string;
};

type FormValues = {
    blocked_services: Record<string, boolean>;
};

interface FormProps {
    initialValues: Record<string, boolean>;
    blockedServices: BlockedService[];
    serviceGroups: ServiceGroups[];
    onSubmit: (values: FormValues) => void;
    processing: boolean;
    processingSet: boolean;
}

export const Form = ({
    initialValues,
    blockedServices,
    serviceGroups,
    processing,
    processingSet,
    onSubmit,
}: FormProps) => {
    const { t } = useTranslation();
    const [searchFilter, setSearchFilter] = useState('');

    const {
        handleSubmit,
        control,
        setValue,
        formState: { isSubmitting },
    } = useForm<FormValues>({
        mode: 'onBlur',
        defaultValues: { blocked_services: initialValues }
    });

    const isServicesControlsDisabled = processing || processingSet;
    const isSubmitDisabled = processing || processingSet || isSubmitting;

    // Filtra los servicios según lo que escribas en la búsqueda
    const filteredServices = useMemo(() => {
        if (!searchFilter.trim()) {
            return blockedServices;
        }
        const query = searchFilter.toLowerCase().trim();
        return blockedServices.filter((service) =>
            service.name.toLowerCase().includes(query) ||
            service.id.toLowerCase().includes(query)
        );
    }, [blockedServices, searchFilter]);

    const servicesByGroup = useMemo(() => {
        return filteredServices.reduce((acc, service) => {
            if (!acc[service.group_id]) {
                acc[service.group_id] = [];
            }
            acc[service.group_id].push(service);
            return acc;
        }, {} as Record<string, BlockedService[]>);
    }, [filteredServices]);

    const handleToggleAllServices = (isSelected: boolean) => {
        filteredServices.forEach((service) => {
            if (!isServicesControlsDisabled) {
                setValue(`blocked_services.${service.id}`, isSelected);
            }
        });
    };

    const handleToggleGroupServices = (groupId: string, isSelected: boolean) => {
        if (isServicesControlsDisabled) {
            return;
        }
        (servicesByGroup[groupId] || []).forEach((service) => {
            setValue(`blocked_services.${service.id}`, isSelected);
        });
    };

    const handleSubmitWithGroups = (values: FormValues) => {
        if (!values || !values.blocked_services) {
            return onSubmit(values);
        }

        const enabledIdsMap = Object.fromEntries(
            blockedServices
                .filter(service => values.blocked_services?.[service.id])
                .map(service => [service.id, true] as const)
        );

        return onSubmit({ blocked_services: enabledIdsMap });
    };

    return (
        <form onSubmit={handleSubmit(handleSubmitWithGroups)}>
            <div className="form__group">
                {/* BARRA DE BÚSQUEDA PERSONALIZADA */}
                <div className="mb-4">
                    <div className="input-icon">
                        <span className="input-icon-addon">
                            🔍
                        </span>
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Buscar aplicación o juego (ej. TikTok, Roblox, Steam, YouTube, Discord)..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                        />
                    </div>
                    {searchFilter && (
                        <div className="mt-2 text-muted small d-flex justify-content-between align-items-center">
                            <span>Mostrando resultados para: <strong>"{searchFilter}"</strong></span>
                            <button
                                type="button"
                                className="btn btn-link btn-sm p-0 text-primary"
                                onClick={() => setSearchFilter('')}
                            >
                                Limpiar búsqueda
                            </button>
                        </div>
                    )}
                </div>

                <div className="blocked_services row mb-5">
                    <div className="col-12 col-md-6 mb-4 mb-md-0">
                        <button
                            type="button"
                            data-testid="blocked_services_block_all"
                            className="btn btn-secondary btn-block font-weight-normal"
                            disabled={isServicesControlsDisabled}
                            onClick={() => handleToggleAllServices(true)}>
                            <Trans>block_all</Trans>
                        </button>
                    </div>
                    <div className="col-12 col-md-6">
                        <button
                            type="button"
                            data-testid="blocked_services_unblock_all"
                            className="btn btn-secondary btn-block font-weight-normal"
                            disabled={isServicesControlsDisabled}
                            onClick={() => handleToggleAllServices(false)}>
                            <Trans>unblock_all</Trans>
                        </button>
                    </div>
                </div>

                {serviceGroups.map((group) => {
                    const groupServices = servicesByGroup[group.id] || [];
                    if (groupServices.length === 0) {
                        return null;
                    }

                    return (
                        <div key={group.id} className="services-group mb-2">
                            <h3 className="h5 mb-3">
                                {t(`servicesgroup.${group.id}.name`, { ns: 'services' })}
                            </h3>
                            {groupServices.length > 1 && (
                                <div className="actions mb-3 d-flex gap-4">
                                    <button
                                        type="button"
                                        className="btn btn-link p-0 text-danger font-weight-normal mr-5"
                                        disabled={isServicesControlsDisabled}
                                        onClick={() => handleToggleGroupServices(group.id, true)}
                                    >
                                        <Trans>block_all</Trans>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-link p-0 text-success font-weight-normal"
                                        disabled={isServicesControlsDisabled}
                                        onClick={() => handleToggleGroupServices(group.id, false)}
                                    >
                                        <Trans>unblock_all</Trans>
                                    </button>
                                </div>
                            )}
                            <div className="services__wrapper">
                                <div className="services">
                                    {groupServices.map((service) => (
                                        <Controller
                                            key={service.id}
                                            name={`blocked_services.${service.id}`}
                                            control={control}
                                            render={({ field }) => (
                                                <ServiceField
                                                    {...field}
                                                    data-testid={`blocked_services_${service.id}`}
                                                    data-groupid={`blocked_services_${service.group_id}`}
                                                    placeholder={service.name}
                                                    disabled={isServicesControlsDisabled}
                                                    icon={service.icon_svg}
                                                />
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="btn-list">
                <button
                    type="submit"
                    data-testid="blocked_services_save"
                    className="btn btn-success btn-standard btn-large"
                    disabled={isSubmitDisabled}>
                    <Trans>save_btn</Trans>
                </button>
            </div>
        </form>
    );
};
