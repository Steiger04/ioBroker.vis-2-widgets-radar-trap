import React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { i18n as I18n } from '@iobroker/adapter-react-v5';
import { camelCase } from 'lodash';

const descriptions = {
    '22,26': 'construction site', // Baustelle
    20: 'traffic jam end', // Stauende
    '21,23,24,25,29': 'danger spot', // Gefahrenstelle
    '101,102,103,104,105,106,107,108,109,110,111,112,113,114,115': 'fixed speed camera', // Blitzer fest
    ts: 'semi-stationary speed camera', // Blitzer teilstationär
    '0,1,2,3,4,5,6': 'mobile speed camera', // Blitzer mobil
    2015: 'mobile speed camera hotspot', // Mobiler Blitzer Hotspot
    vwd: 'police report', // Polizeimeldung
    vwda: 'police report, archive', // Polizeimeldung, Archiv
};

const _children = {
    0: 'unknown', // unbekannt
    1: 'speed camera', // Geschwindigkeitsblitzer
    2: 'traffic light camera', // Ampelblitzer
    3: 'weight control', // Gewichtskontrolle
    4: 'general traffic control', // allg. Verkehrskontrolle
    5: 'alcohol control', // Alkoholkontrolle
    6: 'distance control', // Abstandskontrolle
    7: 'speed camera', // Geschwindigkeitsblitzer
    11: 'traffic light camera', // Ampelblitzer
    12: 'Section Control', // Section Control
    20: 'traffic jam end', // Stauende
    21: 'accident', // Unfall
    22: 'day construction site', // Tagesbaustelle
    23: 'obstacle', // Hindernis
    24: 'risk of slipping', // Rutschgefahr
    25: 'visual obstruction', // Sichtbehinderung
    26: 'permanent construction site', // Dauerbaustelle
    29: 'defective vehicle', // Defektes Fahrzeug
    101: 'distance control', // Abstandskontrolle
    102: 'dummy', // Attrappe
    103: 'ramp control', // Auffahrtskontrolle
    104: 'bus lane control', // Busspurkontrolle
    105: 'entry control', // Einfahrtskontrolle
    106: 'pedestrian crossing', // Fußgängerüberweg
    107: 'speed camera', // Geschwindigkeitsblitzer
    108: 'weight control', // Gewichtskontrolle
    109: 'height control', // Höhenkontrolle
    110: 'traffic light and speed camera', // Ampel- und Geschwindigkeitsblitzer
    111: 'traffic light camera', // Ampelblitzer
    112: 'Section Control', // Section Control
    113: 'section control end', // Section Control Ende
    114: 'speed camera in tunnel', // Blitzer im Tunnel
    115: 'no overtaking', // Überholverbot
    201: 'speed camera', // Geschwindigkeitsblitzer
    206: 'distance control', // Abstandskontrolle
    2015: 'mobile speed camera hotspot', // Mobiler Blitzer Hotspot
    vwd: 'police report', // Polizeimeldung
    vwda: 'police report, archive', // Polizeimeldung, Archiv
    ts: 'speed camera, semi-stationary', // Geschwindigkeitsblitzer, teilstationär
};

const VisTraps = ({ fieldName,  fieldValue,  onDataChange }) => {
    const parents = Object.entries(descriptions)
        .sort((a, b) => I18n.t(a[1]).localeCompare(I18n.t(b[1])))
        .map(([index, description], idx1) => (
            <Box key={idx1}>
                <FormControlLabel
                    sx={{
                        '& .MuiTypography-root': { p: 0, fontSize: 16, fontWeight: 'bold' },
                    }}
                    label={I18n.t(description)}
                    /* label={description} */
                    control={
                        <Checkbox
                            sx={{ pl: '11px' }}
                            checked={Object.values(fieldValue[camelCase(description)]).every(val => val === true)}
                            indeterminate={Object.values(fieldValue[camelCase(description)]).includes(true) && Object.values(fieldValue[camelCase(description)]).includes(false)}
                            onChange={event => {
                                onDataChange({
                                    [fieldName]: {
                                        ...fieldValue,
                                        [camelCase(description)]: {
                                            ...fieldValue[camelCase(description)],
                                            ...Object.fromEntries(Object.entries(_children).filter(([key]) => index.split(',').includes(key)).map(([, value]) => [camelCase(value), event.target.checked])),
                                        },
                                    },
                                });
                            }}
                        />
                    }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                    {Object.entries(_children).sort((a, b) => I18n.t(a[1]).localeCompare(I18n.t(b[1]))).map(([key, value], idx2) => {
                        if (index.split(',').includes(key)) {
                            return (
                                <FormControlLabel
                                    sx={{
                                        '& .MuiTypography-root': { p: 0, fontSize: 13 },
                                    }}
                                    key={idx2}
                                    label={I18n.t(value)}
                                    /* label={value} */
                                    control={
                                        <Checkbox
                                            checked={fieldValue[camelCase(description)][camelCase(value)]}
                                            onChange={event => {
                                                onDataChange({
                                                    [fieldName]: {
                                                        ...fieldValue,
                                                        [camelCase(description)]: {
                                                            ...fieldValue[camelCase(description)],
                                                            [camelCase(value)]: event.target.checked,
                                                        },
                                                    },
                                                });
                                            }}
                                        />
                                    }
                                />
                            );
                        }
                        return null;
                    })}
                </Box>
            </Box>
        ));

    return (
        <Box>
            {parents}
        </Box>
    );
};

export { VisTraps };
