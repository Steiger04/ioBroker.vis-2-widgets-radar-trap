import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import feathers from '@feathersjs/client';

import MenuItem from '@mui/material/MenuItem';
// import ListSubheader from "@mui/material/ListSubheader";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Typography } from '@mui/material';

const VisRadarMapSelect = ({
    type,
    visSocket,
    fieldName,
    fieldValue,
    onDataChange,
}) => {
    const [state, setState] = useState({
        settings: null,
        feathersClient: null,
        listData: [],
        listDataStatus: 'idle',
    });

    useEffect(() => {
        visSocket && visSocket
            .getAdapterInstances('radar-trap')
            .then(res => {
                setState(oldState => ({
                    ...oldState,
                    settings: res[0].native.settings,
                }));

                if (!window.feathersClient) {
                    const activeUrl = new URL(document.URL);
                    const url = `${activeUrl.protocol}//${activeUrl.hostname}:${res[0].native.settings.feathersPort}`;

                    const socket = io(url, {
                        forceNew: true,
                    });

                    window.feathersClient = feathers();
                    window.feathersClient.configure(feathers.socketio(socket));
                    setState(oldState => ({ ...oldState, feathersClient: window.feathersClient }));
                } else {
                    setState(oldState => ({ ...oldState, feathersClient: window.feathersClient }));
                }
            });
    }, [visSocket]);

    useEffect(() => {
        if (!state.feathersClient) return;

        const items = async () => {
            setState(oldState => ({
                ...oldState,
                listDataStatus: 'Loading',
            }));

            if (type === 'area') {
                const areas = await state.feathersClient.service('areas').find({
                    query: { $select: ['_id', 'description'] },
                });

                setState(oldState => ({
                    ...oldState,
                    listData: areas.data,
                    listDataStatus: 'success',
                }));
            }

            if (type === 'route') {
                const routes = await state.feathersClient.service('routes').find({
                    query: { $select: ['_id', 'description'] },
                });

                setState(oldState => ({
                    ...oldState,
                    listData: routes.data,
                    listDataStatus: 'success',
                }));
            }

            if (type === 'all') {
                const areas = await state.feathersClient.service('areas').find({
                    query: { $select: ['_id', 'description'] },
                });

                const routes = await state.feathersClient.service('routes').find({
                    query: { $select: ['_id', 'description'] },
                });

                setState(oldState => ({
                    ...oldState,
                    listData: [...routes.data, ...areas.data],
                    listDataStatus: 'success',
                }));
            }
        };

        items();
    }, [state.feathersClient, type]);

    const listItems = state.listData.map(data => (
        <MenuItem key={data._id} value={data._id}>
            <Typography variant="subtitle2">{data.description}</Typography>
        </MenuItem>
    ));

    return state.listDataStatus === 'success' ? (
        <FormControl variant="standard" sx={{ width: '100%' }}>
            <Select
                sx={{
                    '& .MuiTypography-root': { p: 0, fontSize: 13 },
                    '& .MuiSelect-select': { p: 0 },
                }}
                value={fieldValue}
                onChange={e => {
                    onDataChange({
                        [fieldName]: e.target.value,
                    });
                }}
            >
                <MenuItem sx={{ fontStyle: 'italic' }} value="">
                    <Typography variant="subtitle2">none</Typography>
                </MenuItem>
                { listItems }
            </Select>
        </FormControl>
    ) : null;
};

export { VisRadarMapSelect };
