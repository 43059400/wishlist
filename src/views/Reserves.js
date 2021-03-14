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

const Reserves = (props) => {
    const [filterReserves, setFilterReserves] = React.useState('None')

    React.useEffect(() => {
        if(props.usersReserves.length <= 0) {
            props.getReserves()
        }
    });

    const columns = [
        {id: 'item-id', label: 'id', minWidth: 20},
        { id: 'item-name', label: 'item name', minWidth: 100},
        {
          id: 'reserves',
          label: 'reserves',
          minWidth: 100
        },
      ]

    const makeReservesObject = () => {
        let reservesObjectLocal = {}
        props.usersReserves.forEach(element => {
            if(reservesObjectLocal.hasOwnProperty(element.zone_name)) {
                if(reservesObjectLocal[element.zone_name].hasOwnProperty(element.item_name)) {
                    reservesObjectLocal[element.zone_name][element.item_name]['reserve_list'].push(element)
                } else {
                    reservesObjectLocal[element.zone_name][element.item_name] = {
                        img_name: element.img_name,
                        item_name: element.item_name, 
                        item_id: element.item_id,
                        zone_id: element.zone_id,
                        zone_name: element.zone_name,
                        reserve_list: []
                    }
                    reservesObjectLocal[element.zone_name][element.item_name]['reserve_list'].push(element)
                }
            } else {
                reservesObjectLocal[element.zone_name] = {}
                reservesObjectLocal[element.zone_name][element.item_name] = {
                    img_name: element.img_name,
                    item_name: element.item_name, 
                    item_id: element.item_id,
                    zone_id: element.zone_id,
                    zone_name: element.zone_name,
                    reserve_list: []
                }
                reservesObjectLocal[element.zone_name][element.item_name]['reserve_list'].push(element)
            }
        })

        return reservesObjectLocal
    }

    const handleChange = (e) => {
        setFilterReserves(e.target.value)
    }

    const transformAlias = (alias_id) => {
        let selected = ''
        props.allAlias.forEach((myAlias) => {
            if(myAlias.alias_id === alias_id) {
                selected = myAlias.name
            }
        })

        return selected
    }

    const renderReservesListByZone = () => {
        let reservesObjectLocal = makeReservesObject()

        return Object.keys(reservesObjectLocal).map((keyname, i) => {
            if(filterReserves === keyname || filterReserves === 'None') {
                return (
            <TableContainer className={''}>
                <h3>{keyname}</h3>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                {columns.map((column) => (
                    <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    >
                    {column.label}
                    </TableCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.keys((reservesObjectLocal[keyname])).map((row, row_index) => {
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={i + row_index} >
                            <TableCell>
                                {reservesObjectLocal[keyname][row].item_id}
                            </TableCell>
                            <TableCell>
                                <img alt={reservesObjectLocal[keyname][row].image_name} src={`/images/${reservesObjectLocal[keyname][row].img_name}`}/>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <a href={`https://classic.wowhead.com/item=${reservesObjectLocal[keyname][row].item_id}`} target='_blank' rel='noreferrer'>{row}</a>
                            </TableCell> 
                            <TableCell>
                                {reservesObjectLocal[keyname][row]['reserve_list'].sort(function(a, b){return a.priority-b.priority}).map((row, reserveIndex) => {
                                    return(<span>({row.priority})&nbsp;{transformAlias(row.alias_id)}&nbsp;</span>)
                                })}
                            </TableCell>
                        </TableRow>
                        )
                    })}
                </TableBody>
                </Table>
            </TableContainer> 
         )
        }
        })
    }

    return(
        <span>
            <Box component="span" m={1}>
            <h3>Reserves</h3>
                <Paper>
                    <FormControl >
                        <InputLabel htmlFor="zone-native-helper">Zone</InputLabel>
                        <NativeSelect
                        value={filterReserves}
                        onChange={handleChange}
                        >
                        <option value='None' key='none'>None</option>
                        {Object.keys(makeReservesObject()).map((keyname, i) => {
                            return(
                                <option key={i+keyname} value={keyname}>{keyname}</option>
                            )
                        })}
                        </NativeSelect>
                        <FormHelperText>Select zone to filter</FormHelperText>
                    </FormControl>
                    {renderReservesListByZone()}
                </Paper>
            </Box>
        </span>
    )
}

export default Reserves