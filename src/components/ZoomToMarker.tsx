import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

interface ZoomToMarkerProps {
    position: [number, number];
    isSelected: boolean;
}

const ZoomToMarker = ({ position, isSelected }: ZoomToMarkerProps) => {
    const map = useMap();
    
    useEffect(() => {
        if (isSelected) {
            map.setView(position, 15, {
                animate: true,
                duration: 1
            });
        }
    }, [isSelected, position, map]);

    return null;
};

export default ZoomToMarker; 