import React from 'react';
import PropTypes from 'prop-types'
import { searchAirports, searchFlights } from '../actions/';
import { connect } from 'react-redux';
import FlightsSearchForm from '../components/FlightSearch/FlightsSearchForm';

class FlightSearchContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            departureAirport: emptyAirport,
            arrivalAirport: emptyAirport,
            departureAirports: [],
            arrivalAirports: [],
            passengerCount: 1,
        }
    }

    static contextTypes = {
        router: PropTypes.object
    }

    onAirportChange = (event, value, isDeparture) => {
        const searchResultKey = isDeparture ? "departureAirports" : "arrivalAirports";

        if (value) {
            searchAirports(value, isDeparture).then(data => {
                this.setState({
                    [searchResultKey]: data
                })
            })
        }

        const inputKey = isDeparture ? "departureAirport" : "arrivalAirport";
        this.setState({
            [inputKey]: {
                ...emptyAirport,
                search: value
            }
        })
    }

    onAirportSelect = (event, { code, city, country }, isDeparture) => {
        const key = isDeparture ? "departureAirport" : "arrivalAirport";

        this.setState({
            [key]: {
                search: city + " - " + code,
                code, city, country
            }
        })
    }

    onDateSelect = (field, value) => {
        this.setState({
            [field]: value
        })
    }

    onSetPassengerCount = (value) => {
        this.setState({
            passengerCount: value
        })
    }

    onSearchClick = () => {
        const isFormValid = this.validateForm()
        if (!isFormValid) {
            return;
        }

        this.props.searchFlights(this.state).then(
            (result) => console.log(result),
            (message) => console.log(message)
        )

        this.context.router.history.push('/search');
    }

    validateForm = () => {
        if (this.state.departureAirport.code === '' || this.state.arrivalAirport.code === '') {
            this.setErrorMessage('Please select departure and arrival airports from auto complete list');
            return false;
        }

        if (!this.state.departureDate) {
            this.setErrorMessage('Please select departure date');
            return false;
        }

        this.setErrorMessage(null);

        return true;
    }

    setErrorMessage = (message) => {
        this.setState({
            errorMessage: message
        })
    }

    componentWillUpdate = (nextProps, nextState) => {
        if (this.props.request !== nextProps.request) {
            this.setState({
                ...nextProps.request,
                errorMessage: null
            });
        }
    }

    componentWillMount = () => {
        if (this.props.request) {
            this.setState({
                ...this.props.request,
                errorMessage: null
            });
        }
    }

    render = () =>
        <FlightsSearchForm
            departureAirport={this.state.departureAirport.search}
            departureAirports={this.state.departureAirports}
            arrivalAirport={this.state.arrivalAirport.search}
            arrivalAirports={this.state.arrivalAirports}
            onAirportChange={this.onAirportChange}
            onAirportSelect={this.onAirportSelect}
            departureDate={this.state.departureDate}
            arrivalDate={this.state.arrivalDate}
            onDateSelect={this.onDateSelect}
            onSetPassengerCount={this.onSetPassengerCount}
            passengerCount={this.state.passengerCount}
            onSearchClick={this.onSearchClick}
            position={this.props.position}
            isLoading={this.props.isLoading}
            errorMessage={this.state.errorMessage}
        />
}

const emptyAirport = { search: '', city: '', code: '', country: '' };

const mapStateToProps = state => {
    return {
        request: state.search.request,
        isLoading: state.search.isLoading
    }
}

const mapDispatchToProps = {
    searchFlights
}

export default connect(mapStateToProps, mapDispatchToProps)(FlightSearchContainer);