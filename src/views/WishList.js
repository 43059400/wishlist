import React from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import NativeSelect from '@material-ui/core/NativeSelect'
import FormHelperText from '@material-ui/core/FormHelperText'

import { Button } from '@material-ui/core'

const WishList = (props) => {

    React.useEffect(() => {
        if(props.wishes.length <= 0) {
           props.getWishes()
        }
    })
    const [filterWishes, setFilterWishes] = React.useState('None')

    const columns = [
        { id: 'id', label: 'ID', minWidth: 50},
        { id: 'character_id', label: 'Character Name', minWidth: 75},
        { id: 'name', label: 'Name', minWidth: 250},
        { id: 'npc', label: 'npc', minWidth: 100},
        {
          id: 'type',
          label: 'type',
          minWidth: 50,
        },
        {
          id: 'slot',
          label: 'slot',
          minWidth: 150,
        },
        {
          id: 'zone',
          label: 'zone',
          minWidth: 50
        },
        {
            id: 'remove',
            label: '',
            minWidth: 50
          },
          {
              id: 'priority',
              label: '',
              minWidth: 150
          }
      ]

    const deleteWish = (item) => {
        props.socket.emit('delete_wish', props.user, item)
    }

    const handleWish = (item) => {
        deleteWish(item)
    }

    const handleChange = (e) => {
        setFilterWishes(e.target.value)
    }

    const handleChangePriority = (e, item) => {
        let priorityLocal = e.target.value
        props.socket.emit('update_wish_priority', props.user, item, priorityLocal)
    }

    const makeWishesObject = () => {
        let wishesObjectLocal = {}

        props.wishes.forEach(element => {
            if(wishesObjectLocal.hasOwnProperty(element.zone_name)) {
                wishesObjectLocal[element.zone_name].push(element)
            } else {
                wishesObjectLocal[element.zone_name] = []
                wishesObjectLocal[element.zone_name].push(element)
            }
        })
        return wishesObjectLocal
    }

    const sortByPriority = (wishes) => {
        return wishes.sort((a, b)  => {
            return a.priority - b.priority
        }) 
    }

    const renderWishListByZone = () => {
        let wishesObjectLocal = makeWishesObject()

        return Object.keys(wishesObjectLocal).map((keyname, i) => {
            if(filterWishes === keyname || filterWishes === 'None') {
                return (
                    <TableContainer className={''}>
                    <h3>{keyname}</h3>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {columns.map((column) => (
                            <TableCell
                            key={column.id + keyname}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                            >
                            {column.label}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {sortByPriority((wishesObjectLocal[keyname])).map((row, index) => {
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={index + row+ keyname} >
                                <TableCell>
                                    {row.item_id}
                                </TableCell>
                                <TableCell>
                                    {row.alias_id === '' ? row.user_id: row.alias_id}
                                </TableCell>
                                <TableCell>
                                    <img alt={row.item_name} src={`/images/${row.item_image_name}`}/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <a href={`https://classic.wowhead.com/item=${row.item_id}`} target='_blank' rel='noreferrer'>{row.item_name}</a>
                                </TableCell> 
                                <TableCell>
                                    <a href={`https://classic.wowhead.com/npc=${row.npc_id}`} target='_blank' rel='noreferrer'>{row.npc_name}</a>
                                </TableCell>
                                <TableCell>
                                    {row.item_type}
                                </TableCell>
                                <TableCell>
                                    {row.item_slot}
                                </TableCell>
                                <TableCell>
                                    <a href={`https://classic.wowhead.com/zone=${row.zone_id}`} target='_blank' rel='noreferrer'>{row.zone_name}</a>
                                </TableCell>
                                <TableCell>
                                    <Button variant='contained' onClick={() => {handleWish(row)}} color="secondary">Remove</Button>
                                </TableCell>
                                <Table>
                                <FormControl >
                                <InputLabel htmlFor="item-priority--native-helper"></InputLabel>
                                <NativeSelect
                                    value={row.priority}
                                    onChange={(e) => { handleChangePriority (e, row)}}
                                    >
                                        <option value='1' key={'1' + row.item_id}>1</option>
                                        <option value='2' key={'2' + row.item_id}>2</option>
                                        <option value='3' key={'3' + row.item_id}>3</option>
                                        <option value='4' key={'4' + row.item_id}>4</option>
                                        <option value='5' key={'5' + row.item_id}>5</option>
                                    </NativeSelect>
                                    <FormHelperText>change item priority</FormHelperText>
                                </FormControl>
                                </Table>
                            </TableRow>
                        )})}
                    </TableBody>
                    </Table>
                    <br />
                </TableContainer> 
                )
            } else {
                return (<span></span>)
            }
        })
    }


    return(
        <span>
            <Box component="span" m={1}>
                <h3>My Wish List</h3>
                <FormControl >
                    <InputLabel htmlFor="zone-native-helper">Zone</InputLabel>
                    <NativeSelect
                    value={filterWishes}
                    onChange={handleChange}
                    >
                    <option value='None' key='none'>None</option>
                    {Object.keys(makeWishesObject()).map((keyname, i) => {
                        return(
                            <option key={i+keyname} value={keyname}>{keyname}</option>
                        )
                    })}
                    </NativeSelect>
                    <FormHelperText>Select zone to filter</FormHelperText>
                </FormControl>
                <Paper>
                    {renderWishListByZone()}
                </Paper>
            </Box>
        </span>
    )
}

export default WishList