import React from 'react';
import { Typography } from '@mui/material';
import { i18n as I18n } from '@iobroker/adapter-react-v5';
import { RadarTrapInfoList } from './Components/RadarTrapInfoList';
import { VisRadarMapSelect } from './Components/VisRadarMapSelect';
import { Message } from './Components/Message';
import RadarTrapGeneric from './RadarTrapGeneric';

class RadarTrapInfoWidget extends RadarTrapGeneric {
    constructor(props) {
        super(props);

        this.language = this.props.context.systemConfig.common.language;
        this.state = {
            ...this.state, settings: null, feathersClient: null,
        };
    }

    static getWidgetInfo() {
        return {
            id: 'tplRadarTrapsInfoWidget',
            visSet: 'vis-2-widgets-radar-trap',
            visSetColor: '#4169E1', // Color of widget set. it is enough to set color only in one widget of set
            visName: 'info',
            visWidgetLabel: 'info',
            visAttrs: [
                {
                    name: 'common', // group name
                    fields: [
                        {
                            name: 'description',
                            default: '',
                            hidden: true,
                        },
                        {
                            name: 'noCard',
                            label: 'without_card',
                            type: 'checkbox',
                        },
                        {
                            name: 'routeOrAreaId',
                            label: 'route_or_area_id',
                            default: '',
                            type: 'custom',  // important
                            component: (     // important
                                field,       // field properties: {name, label, type, set, singleName, component,...}
                                data,        // widget data
                                onDataChange, // function to call, when data changed
                                props,       // additional properties : {socket, projectName, instance, adapterName, selectedView, selectedWidgets, project, widgetID}
                                // widgetID: widget ID or widgets IDs. If selecteld more than one widget, it is array of IDs
                                // project object: {VIEWS..., [view]: {widgets: {[widgetID]: {tpl, data, style}}, settings, parentId, rerender, filterList, activeWidgets}, ___settings: {}}
                            ) => (<VisRadarMapSelect
                                type="all"
                                visSocket={props.context.socket}
                                fieldName={field.name}
                                fieldValue={data[field.name] || field.default}
                                onDataChange={onDataChange}
                            />),
                        },
                        {
                            name: 'nothingInfo',
                            label: 'nothing_info',
                            type: 'checkbox',
                            default: false,
                        },
                        {
                            name: 'symbolColor',
                            label: 'symbol_color',
                            type: 'color',
                            default: '#263238',
                        },
                        {
                            name: 'groupHeadline',
                            label: 'group_headline',
                            type: 'checkbox',
                            default: true,
                        },
                        {
                            name: 'trapHeadline',
                            label: 'trap_headline',
                            type: 'checkbox',
                            default: true,
                        },
                    ],
                },
                {
                    name: 'traps',
                    label: 'group_traps',
                    fields: [
                        {
                            name: 'fixedTrap',
                            label: 'fixed_trap',
                            type: 'checkbox',
                            default: true,
                        },
                        {
                            name: 'speedTrap',
                            label: 'speed_trap',
                            type: 'checkbox',
                            default: true,
                        },
                        {
                            name: 'mobileTrap',
                            label: 'mobile_trap',
                            type: 'checkbox',
                            default: true,
                        },
                        {
                            name: 'trafficJam',
                            label: 'traffic_jam',
                            type: 'checkbox',
                            default: true,
                        },
                        {
                            name: 'accident',
                            label: 'accident',
                            type: 'checkbox',
                            default: true,
                        },
                        {
                            name: 'roadWork',
                            label: 'road_work',
                            type: 'checkbox',
                            default: true,
                        },
                        {
                            name: 'object',
                            label: 'object',
                            type: 'checkbox',
                            default: true,
                        },
                        {
                            name: 'sleekness',
                            label: 'sleekness',
                            type: 'checkbox',
                            default: true,
                        },
                        {
                            name: 'fog',
                            label: 'fog',
                            type: 'checkbox',
                            default: true,
                        },
                        {
                            name: 'policeNews',
                            label: 'police_news',
                            type: 'checkbox',
                            default: true,
                        },
                        {
                            name: 'closedCongestedRoad',
                            label: 'closed_congested_road',
                            type: 'checkbox',
                            default: true,
                        },
                    ],
                },
                // check here all possible types https://github.com/ioBroker/ioBroker.vis/blob/react/src/src/Attributes/Widget/SCHEMA.md
            ],
            visDefaultStyle: {
                width: '100%',
                height: 200,
                position: 'relative',
            },
            visPrev: 'widgets/vis-2-widgets-radar-trap/img/prev-info-widget.png',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    propertiesUpdate() {
        // Widget has 3 important states
        // 1. this.state.values - contains all state values, that are used in widget (automatically collected from widget info).
        //                        So you can use `this.state.values[this.state.rxData.oid + '.val']` to get value of state with id this.state.rxData.oid
        // 2. this.state.rxData - contains all widget data with replaced bindings. E.g. if this.state.data.type is `{system.adapter.admin.0.alive}`,
        //                        then this.state.rxData.type will have state value of `system.adapter.admin.0.alive`
        // 3. this.state.rxStyle - contains all widget styles with replaced bindings. E.g. if this.state.styles.width is `{javascript.0.width}px`,
        //                        then this.state.rxData.type will have state value of `javascript.0.width` + 'px
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    componentDidMount() {
        super.componentDidMount();

        // Update data
        this.propertiesUpdate();
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return RadarTrapInfoWidget.getWidgetInfo();
    }

    // This function is called every time when rxData is changed
    onRxDataChanged() {
        this.propertiesUpdate();
    }

    // This function is called every time when rxStyle is changed
    // eslint-disable-next-line class-methods-use-this
    onRxStyleChanged() {}

    // This function is called every time when some Object State updated, but all changes lands into this.state.values too
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    onStateUpdated(id, state) {}

    renderWidgetBody(props) {
        super.renderWidgetBody(props);

        const content =  this.state.radarTrapEnabled ? (
            <RadarTrapInfoList
                feathersClient={this.state.feathersClient}
                routeOrAreaId={this.state.rxData.routeOrAreaId || null}
                data={this.state.rxData}
                style={this.state.rxStyle}
            />
        ) : <Message message={`${I18n.t('For the configuration the radar-trap instance must be started')}`} />;

        const contentHeader = this.state.rxData.description && this.state.radarTrapEnabled ?
            <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight:'bold', pb: 1 }}
            >
                {this.state.rxData.description}
            </Typography> :
            null;

        if (this.state.rxData.noCard || props.widget.usedInWidget) return content;

        return this.wrapContent(
            content,
            // null,
            contentHeader,
            {
                height:'100%', width: '100%', padding: 10, boxSizing: 'border-box',
            },
        );
    }
}

export default RadarTrapInfoWidget;
