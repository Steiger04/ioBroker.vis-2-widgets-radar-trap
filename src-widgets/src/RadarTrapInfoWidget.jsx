import { i18n as I18n } from "@iobroker/adapter-react-v5";
import { Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import { Message } from "./Components/Message";
import { RadarTrapInfoList } from "./Components/RadarTrapInfoList";
import { VisRadarMapSelect } from "./Components/VisRadarMapSelect";
import { VisTraps } from "./Components/VisTraps";
import visTrapsDefault from "./Components/visTrapsDefault";
import Generic from "./Generic";

class RadarTrapInfoWidget extends Generic {
	constructor(props) {
		super(props);

		this.language = this.props.context.systemConfig.common.language;
		/* this.state = {
            ...this.state, settings: null, feathersClient: null,
        }; */
	}

	static getWidgetInfo() {
		return {
			id: "tplRadarTrapsInfoWidget",
			visSet: "vis-2-widgets-radar-trap",
			visSetColor: "#4169E1", // Color of widget set. it is enough to set color only in one widget of set
			visName: "info",
			visWidgetLabel: "info",
			visAttrs: [
				{
					name: "common", // group name
					fields: [
						{
							name: "noCard",
							label: "without_card",
							type: "checkbox",
						},
						{
							name: "oid",
							label: "title",
							type: "id",
							noInit: true,
							filter: { common: { type: "string" } },
						},
						{
							name: "routeOrAreaId",
							label: "route_or_area_id",
							default: "",
							type: "custom", // important
							component: (
								// important
								field, // field properties: {name, label, type, set, singleName, component,...}
								data, // widget data
								onDataChange, // function to call, when data changed
								props, // additional properties : {socket, projectName, instance, adapterName, selectedView, selectedWidgets, project, widgetID}
								// widgetID: widget ID or widgets IDs. If selecteld more than one widget, it is array of IDs
								// project object: {VIEWS..., [view]: {widgets: {[widgetID]: {tpl, data, style}}, settings, parentId, rerender, filterList, activeWidgets}, ___settings: {}}
							) => (
								<VisRadarMapSelect
									type="all"
									visSocket={props.context.socket}
									fieldName={field.name}
									fieldValue={data[field.name] || field.default}
									onDataChange={onDataChange}
								/>
							),
						},
						{
							name: "nothingInfo",
							label: "nothing_info",
							type: "checkbox",
							default: false,
						},
						{
							name: "symbolColor",
							label: "symbol_color",
							type: "color",
							default: "rgba(100,100,100,0.8)",
						},
						{
							name: "groupHeadline",
							label: "group_headline",
							type: "checkbox",
							default: true,
						},
						{
							name: "trapHeadline",
							label: "trap_headline",
							type: "checkbox",
							default: true,
						},
					],
				},
				{
					name: "traps",
					label: "group_traps",
					fields: [
						{
							name: "onlyNewTraps",
							label: "only_new_traps",
							type: "checkbox",
							noBinding: true,
							default: false,
						},
						{
							name: "visTraps",
							// label: 'vis_traps',
							label: "group_traps",
							noBinding: true,
							default: visTrapsDefault,
							type: "custom", // important
							component: (
								// important
								field, // field properties: {name, label, type, set, singleName, component,...}
								data, // widget data
								onDataChange, // function to call, when data changed
								// props,       // additional properties : {socket, projectName, instance, adapterName, selectedView, selectedWidgets, project, widgetID}
								// widgetID: widget ID or widgets IDs. If selecteld more than one widget, it is array of IDs
								// project object: {VIEWS..., [view]: {widgets: {[widgetID]: {tpl, data, style}}, settings, parentId, rerender, filterList, activeWidgets}, ___settings: {}}
							) => (
								<VisTraps
									fieldName={field.name}
									fieldValue={data[field.name] || field.default}
									onDataChange={onDataChange}
								/>
							),
						},
					],
				},
				// check here all possible types https://github.com/ioBroker/ioBroker.vis/blob/react/src/src/Attributes/Widget/SCHEMA.md
			],
			visDefaultStyle: {
				width: "100%",
				height: 200,
				position: "relative",
			},
			visPrev: "widgets/vis-2-widgets-radar-trap/img/prev-info-widget.png",
		};
	}

	// eslint-disable-next-line class-methods-use-this
	async propertiesUpdate() {
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

		const content = this.state.radarTrapEnabled ? (
			<ThemeProvider theme={this.props.context.theme}>
				<RadarTrapInfoList
					feathersClient={this.state.feathersClient}
					routeOrAreaId={this.state.rxData.routeOrAreaId || null}
					data={this.state.rxData}
					style={this.state.rxStyle}
				/>
			</ThemeProvider>
		) : (
			<Message
				message={`${I18n.t("For the configuration the radar-trap instance must be started")}`}
			/>
		);

		const value = this.getValue();
		const contentHeader =
			this.state.radarTrapEnabled && value ? (
				<Typography
					variant="h6"
					component="h5"
					sx={{
						pb: 1,
						fontFamily: this.state.rxStyle["font-family"],
						fontWeight: this.state.rxStyle["font-weight"]
							? this.state.rxStyle["font-weight"]
							: "bold",
						fontSize: this.state.rxStyle["font-size"]
							? this.state.rxStyle["font-size"]
							: "large",
						lineHeight: this.state.rxStyle["line-height"],
						letterSpacing: this.state.rxStyle["letter-spacing"],
						wordSpacing: this.state.rxStyle["word-spacing"],
					}}
				>
					{value}
				</Typography>
			) : null;

		if (this.state.rxData.noCard || props.widget.usedInWidget) return content;

		return this.wrapContent(content, contentHeader, {
			height: "100%",
			width: "100%",
			padding: 10,
			boxSizing: "border-box",
		});
	}
}

export default RadarTrapInfoWidget;
