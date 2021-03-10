import React, {useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

import io from 'socket.io-client'

import ItemSearch from './views/ItemSearch'
import WishList from './views/WishList'
import AuditTrail from './views/AuditTrail'
import Reserves from './views/Reserves'
//import Profile from './views/Profile'

import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Slide from '@material-ui/core/Slide'
import CssBaseline from '@material-ui/core/CssBaseline'
import Popover from '@material-ui/core/Popover'

import './App.css'
import UserList from './views/UserList'

const ENDPOINT = 'https://tegritydatabase.com'
const CLIENT_ID = '769370226835193876'
const REDIRECT_URI = encodeURIComponent('https://tegritydatabase.com/api/discord/callback')
const socket = io(ENDPOINT)
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

function HideOnScroll(props) {
  const { children, window } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
}


function App(props) {
  const classes = useStyles()
  const [response, setResponse] = React.useState((new Date()).toString())
  const [user, setUser] = React.useState({
    id:0,
    login:0
  })
  const [items, setItems] = React.useState([])
  const [wishes, setWishes] = React.useState([])
  const [auditTrail, setAuditTrail] = React.useState([])
  const [usersReserves, setUsersReserves] = React.useState([])
  const [userList, setUserList] = React.useState([])
  const [anchorEl, setAnchorEl] = React.useState(null);


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    let queryString = window.location.search
    let urlParams = new URLSearchParams(queryString)
    let id = urlParams.get('id')

    if(id) {
      document.cookie = `id=${id}`
      window.location.replace("https://www.tegritygaming.com");
    } 

    if(parseInt(document.cookie.split('=')[1]) !== undefined) {
      setUser(
        {
          id: document.cookie.split('=')[1] === undefined ?  0 : document.cookie.split('=')[1],
          login: 0
      })
    } 

    socket.on('FromAPI', data => {
      setResponse(new Date(Date.parse(data)).toString())
    })
  }, [])

  useEffect(() => {
    if(user.login === 0 && user.id !== 0) {
      socket.emit('getUserData', user.id)

    }
  }, [user])

  socket.on('user', (userData) => {
    setUser({
      id: userData.id,
      username: userData.username,
      discriminator: userData.discriminator,
      avatar: userData.avatar,
      admin: userData.admin ,
      login: 1
    })
  })

  socket.on('update_audit_trail', (auditTrailData) => {
    setAuditTrail(auditTrailData)
  })

  socket.on('update_reserves', (reservesData) => {
    setUsersReserves(reservesData)
  })


  socket.on('items', (items) => {
    setItems(items)
  })

  socket.on('update_wishes', (wishes) => {
    setWishes(wishes)
  })

  socket.on('update_user_list', (users) => {
    setUserList(users)
  })

  const logOut = (e) => {
    let addExpire = 'expires=Thu, 18 Dec 2013 12:00:00 UTC path=/'
    document.cookie = `id=0;${addExpire}`
    setUser(
      {
        id: document.cookie.split('=')[1] === undefined ?  0 : document.cookie.split('=')[1],
        login: 0
    })
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const getAuditTrail = () => {
    socket.emit('get_audit_trail')
  }

  const getReserves = () => {
    socket.emit('get_reserves')
  }

  const getUserList = () => {
    socket.emit('get_user_list')
  }

  const getWishes = () => {
    socket.emit('get_wish_list', user)
  }

  const getItems = () => {
    socket.emit('getItems', user)
  }

  const openTicket =(e) => {
    setAnchorEl(e.currentTarget)
  }

  const displayDashboard = () => {
    if(user.login === 1) {    
      return (
          <Router>
            <CssBaseline />
            <AppBar position="static">
              <Toolbar>
                <Typography  edge="start" variant="h6" color="inherit" className={classes.title}>
                ({user.username}#{user.discriminator})&nbsp;Tegrity Beta
                </Typography>
                <Typography className={classes.title}>
                  <Button aria-describedby={id} variant='contained' onClick={openTicket} color="secondary">Open Ticket</Button>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <Typography className={classes.typography}>This button does nothing.</Typography>
                  </Popover>
                </Typography>
                <Typography className={classes.menuButton}>
                  <Link to='/item-search' onClick={getItems} >Item Search</Link>
                </Typography>
                <Typography className={classes.menuButton}>
                  <Link to='/wish-list' onClick={getWishes} >My Wish List</Link>
                </Typography>
              
                <Typography className={classes.menuButton}>
                <Link to='/audit-trail'>Audit Trail</Link>  
                </Typography>
                <Typography className={classes.menuButton}>
                  <Link to='/reserves'>Reserves</Link>
                </Typography>
                <Typography className={classes.menuButton}>
                  <Link to='/user-list'>User List</Link>
                </Typography>
                <Typography className={classes.menuButton}>
                  <Button color="inherit" onClick={logOut} href='https://www.tegritygaming.com'>Logout</Button>
                </Typography>
              </Toolbar>
            </AppBar>
            <Toolbar />
            <Container>
              <Box>
                <Switch>
                  <Route path='/item-search'>
                    <ItemSearch items={items} socket={socket} user={user}  wishes={wishes} setWishes={setWishes} getItems={getItems}/>
                  </Route>
                  <Route path='/wish-list'>
                    <WishList items={items} socket={socket} user={user} wishes={wishes} setWishes={setWishes}  getWishes={getWishes}/>
                  </Route>
                  <Route path='/audit-trail'>
                    <AuditTrail auditTrail={auditTrail} getAuditTrail={getAuditTrail} />
                  </Route>
                  <Route path='/reserves'>
                  <Reserves usersReserves={usersReserves} getReserves={getReserves} />
                  </Route>
                  <Route path='/user-list'>
                    <UserList userList={userList} getUserList={getUserList} /> 
                  </Route>
                  <Route path='/'>
                    <ItemSearch items={items} socket={socket} user={user}  wishes={wishes} setWishes={setWishes} getItems={getItems}/>
                  </Route>
                </Switch>
              </Box>
            </Container>
          </Router>
      )
    }
  }

  const displayLogin = () => {
    if(user.login === 0) {
      return (
        <div className='App' >
          <header className='App-header' style={{backgroundImage: `url(/images/tegrity.jpg`}}>
          <span>
            {response}
            <br />
            <h1>Tegrity</h1>
            <Button variant='contained' color='primary' href={`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify`}>Login</Button>
          </span>
          </header>
        </div>
      )
    }
  }

  return (
    <div className='root'>
        {displayLogin()}
        {displayDashboard()}
    </div>
  )
}

export default App
