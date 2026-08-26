'use client';

import { useEffect, useRef, useState } from 'react';

interface UseHeaderVisibilityOptions {
    /** px de scroll acumulado antes de ocultar/mostrar */
    threshold?: number;
    /** siempre visible mientras estemos a menos de esta distancia del top */
    topOffset?: number;
}

export function useHeaderVisibility({
    threshold = 10,
    topOffset = 96,
}: UseHeaderVisibilityOptions = {}) {
    const [visible, setVisible] = useState(true);
    const lastY = useRef(0);
    const accumulated = useRef(0);

    useEffect(() => {
        lastY.current = window.scrollY;

        const onScroll = () => {
            const y = window.scrollY;
            const delta = y - lastY.current;

            if (y < topOffset) {
                setVisible(true);
                accumulated.current = 0;
                lastY.current = y;
                return;
            }

            // sólo acumula si el gesto sigue en la misma dirección
            if ((delta > 0 && accumulated.current < 0) || (delta < 0 && accumulated.current > 0)) {
                accumulated.current = 0;
            }
            accumulated.current += delta;

            if (accumulated.current > threshold) {
                setVisible(false);
                accumulated.current = 0;
            } else if (accumulated.current < -threshold) {
                setVisible(true);
                accumulated.current = 0;
            }

            lastY.current = y;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [threshold, topOffset]);

    useEffect(() => {
        // cualquier click/tap en la página (no solo sobre el header) lo vuelve a mostrar
        const onPointerDown = () => setVisible(true);
        window.addEventListener('pointerdown', onPointerDown, { passive: true });
        return () => window.removeEventListener('pointerdown', onPointerDown);
    }, []);

    return { visible, show: () => setVisible(true) };
}