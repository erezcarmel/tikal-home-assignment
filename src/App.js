import { useEffect, useState, useCallback } from 'react';
import { EventsService } from './services';
import './App.css';

const PAGE_LIMIT = 100;

const App = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState({});
  const [sports, setSports] = useState([]);
  const [page, setPage] = useState(1);

	useEffect(() => {
    loadEvents({ limit: PAGE_LIMIT, page });
  }, []);

  useEffect(() => {
    loadEvents({ limit: PAGE_LIMIT, page, filter });
  }, [page]);

  const handleFilterChange = (type, value) => setFilter({ ...filter, [type]: value });

  const handlePageChange = (direction) => {
    setLoading(true);
    setPage(page + direction)
  };

  const filterEvents = () => {
    setPage(1);
    loadEvents({ limit: PAGE_LIMIT, page: 1, filter })
  };

  const loadEvents = useCallback(async ({ limit = PAGE_LIMIT, page, filter }) => {
    try {
      const res = await EventsService.all({ limit, page, filter });
      setEvents(res);
      setSports(res.map(event => event.sport));
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="App">
      <div className='filter'>
        <p>Filter by event name:</p>
        <input type='text' onChange={(e) => handleFilterChange('event.contains', e.target.value)}/>

        <p>Filter by medal:</p>
        <select onChange={(e) => handleFilterChange('medal.contains', e.target.value)}>
          <option value=''>All</option>
          <option value='bronze'>Bronze</option>
          <option value='silver'>Silver</option>
          <option value='gold'>Gold</option>
        </select>

        <p>Filter by sport:</p>
		    <select onChange={(e) => handleFilterChange('sport.contains', e.target.value)}>
          <option value=''>All</option>
          { sports.map(sport => <option value={sport}>{sport}</option>)}
        </select>

        <button type='button' onClick={filterEvents}>Filter</button>
      </div>

      <div className='pagination'>
        { page > 1 && <button onClick={() => handlePageChange(-1)}>Prev</button>}
        { page }
        <button onClick={() => handlePageChange(1)}>Next</button>
      </div>
      { loading ?
          <div className='loader'>Loading</div> :
          <table>
            <tr>
              <th>Event</th>
              <th>Game</th>
              <th>Player</th>
            </tr>
            { events.map(event =>
                <tr key={event.eventId}>
                  <td>{event.event}</td>
                  <td>{event.game.games}</td>
                  <td>{event.player.name}</td>
                </tr>
            )}
          </table>
      }
    </div>
  );
}

export default App;
