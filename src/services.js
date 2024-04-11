import axios from 'axios';

const API_URL = 'http://fe-home-assignment.infra.tikal.io/api';

const parseFilters = (filters) => Object.keys(filters).map(key => `${key}=${filters[key]}&`);

export const PlayersService = {
	all: async ({ limit = 100, page = 1, filter = {}}) => {
		try {
			return axios.get(`${API_URL}/players?_limit=${limit}&_page=${page}&${parseFilters(filter)}`);
		} catch (e) {
			return Promise.reject(e);
		}
	}
};

export const GamesService = {
	all: async ({ limit = 100, page = 1, filter = {}}) => {
		try {
			return axios.get(`${API_URL}/games?_limit=${limit}&_page=${page}&${parseFilters(filter)}`);
		} catch (e) {
			return Promise.reject(e);
		}
	}
};

export const EventsService = {
	all: async ({ limit = 100, page = 1, filter = {}}) => {
		try {
			const { data: events } = await axios.get(`${API_URL}/events?_limit=${limit}&_page=${page}&${parseFilters(filter)}`);
			const { data: games } = await GamesService.all({ filter: { 'id.in': `[${events.map(event => `"${event.gameId}"`)}]` }});
			const { data: players } = await PlayersService.all({ filter: { 'id.in': `[${events.map(event => event.playerId)}]` }});

			return events.map(event => ({
				...event, 
				game: games.find(game => game.id === event.gameId),
				player: players.find(player => player.id === event.playerId)
			}));
		} catch (e) {
			return Promise.reject(e);
		}
	}
};