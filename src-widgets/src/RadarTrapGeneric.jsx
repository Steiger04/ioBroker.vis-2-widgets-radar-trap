import io from "socket.io-client";
import feathers from "@feathersjs/client";
import socketio from "@feathersjs/socketio-client";
import Generic from "./Generic";

class RadarTrapGeneric extends Generic {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state, settings: null, feathersClient: null, radarTrapEnabled: false,
        };

        this.settings();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        super.componentDidUpdate(prevProps, prevState, snapshot);

        if (this.state.feathersClient) {
            if (!this.state.radarTrapEnabled && prevState.radarTrapEnabled !== this.state.radarTrapEnabled) {
                this.state.feathersClient.io.disconnect();
            } else {
                this.state.feathersClient.io.connect();
            }
        }
    }

    componentWillUnmount() {
        this.props.context.socket.unsubscribeObject(this.instanceId, (id, obj) => console.log(id, obj));
    }

    async settings() {
        return this.props.context.socket
            .getAdapterInstances("radar-trap")
            .then(res => {
                this.setState({
                    settings: res[0].native.settings,
                });

                if (!window.feathersClient) {
                    const activeUrl = new URL(document.URL);
                    const url = `${activeUrl.protocol}//${activeUrl.hostname}:${res[0].native.settings.feathersPort}`;

                    const socket = io(url, {
                        forceNew: true,
                    });
                    window.feathersClient = feathers();
                    window.feathersClient.configure(socketio(socket, { forceNew: true, timeout: 600_000 }));
                    this.setState({ feathersClient: window.feathersClient });
                } else {
                    this.setState({ feathersClient: window.feathersClient });
                }

                this.setState({ radarTrapEnabled: res[0].common.enabled });

                this.instanceId = res[0]._id;
                this.props.context.socket.subscribeObject(this.instanceId, (id, obj) => {
                    this.setState({ radarTrapEnabled: obj.common.enabled });
                });
            }).catch(err => console.log(err));
    }
}

export default RadarTrapGeneric;
