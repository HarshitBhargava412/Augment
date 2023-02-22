import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { GoPlus } from "react-icons/go";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Notes () {
    const [ totalPages, setTotalPages ] = useState( 0 );
    const [ pageNumber, setPageNumber ] = useState( 0 );
    const [ show, setShow ] = useState( false );
    const [ showEdit, setEditShow ] = useState( false );
    const [ notesArray, setNotesArray ] = useState( [] );
    const [ editArray, setEditArray ] = useState( [ "", "", "", "" ] );
    const [ saveNote, setSaveNote ] = useState( {
        title: "",
        description: ""
    } );

    async function onload () {
        var myHeaders = new Headers();
        myHeaders.append( "Authorization", "Basic " + document.cookie.split( "token=" )[ 1 ] );
        myHeaders.append( "Content-Type", "application/json" );

        // var raw = JSON.stringify( {
        //     title: ,
        //     description: 
        // } );

        var requestOptions = {
            headers: myHeaders,
            method: 'GET'
            // body: raw
        };

        await fetch( "http://localhost:4000/notes?page=0", requestOptions )
            .then( response => response.json() )
            .then( ( data ) => {
                let notesArray = [];
                data.forEach( ( element ) => {
                    notesArray.push( {
                        noteId: element._id,
                        title: element.title,
                        description: element.description
                    } )
                } )
                setNotesArray( [ ...notesArray ] );
            } )
            
            await fetch( "http://localhost:4000/notes/all", requestOptions )
            .then( response => response.json() )
            .then( ( data ) => {
                setTotalPages( parseInt( data.length / 10 ) );

                if ( parseInt( data.length / 10 ) === 0 ) {
                    document.querySelector( ".pagination button:nth-child(2)" ).setAttribute( "disabled", "" );
                }
            } )
    }

    const handleClose = () => setShow( false );
    const handleEditClose = () => setEditShow( false );
    const handleShow = () => setShow( true );
    const handleEditShow = ( event, index ) => {
        console.log( event.target.parentNode.parentNode.childNodes );
        setEditShow( true );
        editArray[ 0 ] = notesArray[ index ].title;
        editArray[ 1 ] = notesArray[ index ].description;
        editArray[ 2 ] = notesArray[ index ].noteId;
        editArray[ 3 ] = index;
        setEditArray( [ ...editArray ] );
    }

    async function handleSave ( event ) {
        if ( saveNote.title !== "" && saveNote.description !== "" ) {
            var myHeaders = new Headers();
            myHeaders.append( "Authorization", "Basic " + document.cookie.split( "token=" )[ 1 ] );
            myHeaders.append( "Content-Type", "application/json" );

            var raw = JSON.stringify( saveNote );

            var requestOptions = {
                headers: myHeaders,
                method: 'POST',
                body: raw
            };

            await fetch( "http://localhost:4000/notes", requestOptions )
                .then( response => response.json() )
                .then( ( data ) => {
                    console.log( data );
                    notesArray.push( {
                        title: data.title,
                        description: data.description,
                        noteId: data._id
                    } )
                    setNotesArray( [ ...notesArray ] );
                    setShow( false );
                } );

        }
    }
    
    async function handleEditSave () {
        if ( editArray[ 0 ] !== "" && editArray[ 1 ] !== "" ) {
            var myHeaders = new Headers();
            myHeaders.append( "Authorization", "Basic " + document.cookie.split( "token=" )[ 1 ] );
            myHeaders.append( "Content-Type", "application/json" );

            var raw = JSON.stringify( {
                title: editArray[ 0 ],
                description: editArray[ 1 ]
            } );

            var requestOptions = {
                headers: myHeaders,
                method: 'PUT',
                body: raw
            };

            await fetch( "http://localhost:4000/notes/" + editArray[ 2 ], requestOptions )
                .then( response => response.json() )
                .then( ( data ) => {
                    console.log( data );
                    notesArray[ editArray[ 3 ] ] = {
                        title: data.title,
                        description: data.description,
                        noteId: data._id
                    };
                    setNotesArray( [ ...notesArray ] );
                    setEditShow( false );
                } );

        }
    }

    async function handleDelete ( event, index ) {
        var myHeaders = new Headers();
        myHeaders.append( "Authorization", "Basic " + document.cookie.split( "token=" )[ 1 ] );
        myHeaders.append( "Content-Type", "application/json" );

        // var raw = JSON.stringify( {
        //     title: editArray[ 0 ],
        //     description: editArray[ 1 ]
        // } );

        var requestOptions = {
            headers: myHeaders,
            method: 'DELETE'
            // body: raw
        };

        await fetch( "http://localhost:4000/notes/" + notesArray[ index ].noteId, requestOptions )
            .then( response => response.json() )
            .then( ( data ) => {
                console.log( data );
                notesArray.splice( index, 1 );
                setNotesArray( [ ...notesArray ] );
            } );
    }

    async function previousPage ( event ) {
        if ( pageNumber >= 0 ) {
            document.querySelector( ".pagination button:nth-child(2)" ).removeAttribute( "disabled" );
            let pageNumberRaw = pageNumber - 1;
            setPageNumber( pageNumberRaw );

            var myHeaders = new Headers();
            myHeaders.append( "Authorization", "Basic " + document.cookie.split( "token=" )[ 1 ] );
            myHeaders.append( "Content-Type", "application/json" );

            var requestOptions = {
                headers: myHeaders,
                method: 'GET'
                // body: raw
            };

            await fetch( "http://localhost:4000/notes?page=" + pageNumberRaw, requestOptions )
                .then( response => response.json() )
                .then( ( data ) => {
                    let notesArray = [];
                    data.forEach( ( element ) => {
                        notesArray.push( {
                            noteId: element._id,
                            title: element.title,
                            description: element.description
                        } )
                    } )
                    setNotesArray( [ ...notesArray ] );
                } )
            if ( pageNumberRaw === 0 ) {
                document.querySelector( ".pagination button:nth-child(1)" ).setAttribute( "disabled", "" );
            }
        }
    }

    async function nextPage ( event ) {
        if ( pageNumber <= totalPages ) {
            document.querySelector( ".pagination button:nth-child(1)" ).removeAttribute( "disabled" );
            let pageNumberRaw = pageNumber + 1;
            setPageNumber( pageNumberRaw );
            
            var myHeaders = new Headers();
            myHeaders.append( "Authorization", "Basic " + document.cookie.split( "token=" )[ 1 ] );
            myHeaders.append( "Content-Type", "application/json" );

            var requestOptions = {
                headers: myHeaders,
                method: 'GET'
                // body: raw
            };

            await fetch( "http://localhost:4000/notes?page=" + pageNumberRaw, requestOptions )
                .then( response => response.json() )
                .then( ( data ) => {
                    let notesArray = [];
                    data.forEach( ( element ) => {
                        notesArray.push( {
                            noteId: element._id,
                            title: element.title,
                            description: element.description
                        } )
                    } )
                    setNotesArray( [ ...notesArray ] );
                } )
            if ( pageNumberRaw === totalPages ) {
                document.querySelector( ".pagination button:nth-child(2)" ).setAttribute( "disabled", "" );
            }
        }
    }

    useEffect( () => {
        if(!document.cookie.split("token=")[1]) {
            window.location.href = "/";
        }
        document.querySelector( ".pagination button:nth-child(1)" ).setAttribute( "disabled", "" );
        onload();
    }, [] );

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                                className='title'
                                type="text"
                                onChange={event => {
                                    saveNote.title = event.target.value;
                                    setSaveNote( saveNote );
                                }}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Task Description</Form.Label>
                            <Form.Control className='description' as="textarea" rows={3} onChange={event => {
                                saveNote.description = event.target.value;
                                setSaveNote( saveNote );
                            }} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={event => handleSave( event )}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEdit} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                                className='edit-title'
                                type="text"
                                defaultValue={editArray[ 0 ]}
                                onChange={event => {
                                    editArray[ 0 ] = event.target.value;
                                    setEditArray( [ ...editArray ] );
                                }}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Task Description</Form.Label>
                            <Form.Control className='edit-description' defaultValue={editArray[ 1 ]} as="textarea" rows={3} onChange={event => {
                                editArray[ 1 ] = event.target.value;
                                setEditArray( [ ...editArray ] );
                            }} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Navbar bg="light" expand="lg">
                <Container fluid style={{ padding: "0 4rem" }}>
                    <Navbar.Brand style={{color: "blue", textDecoration: "underline"}} href="#" >TaskY</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link href="#" onClick={event => {
                                document.cookie = "token=";
                                window.location.href = "/";
                            }}>Log Out</Nav.Link>
                        </Nav>
                        <Form className="d-flex">
                            <Button variant="outline-primary" onClick={event => handleShow( event )}><GoPlus /> Add Task</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="container" style={{ paddingBottom: "2rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                {notesArray.map( ( element, index ) => (
                    <Card style={{ width: '18rem', marginTop: "2rem" }}>
                        <Card.Img variant="top" src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg" />
                        <Card.Body>
                            <Card.Title>{element.title}</Card.Title>
                            <Card.Text style={{ height: "150px", overflow: "hidden" }}>
                                {element.description}
                            </Card.Text>
                            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                                <Button variant="primary" onClick={event => handleEditShow( event, index )}>Open Task</Button>
                                <Button variant="danger" onClick={event => handleDelete( event, index )}>Delete Task</Button>
                            </div>
                        </Card.Body>
                    </Card>
                ) )}
            </div>
            <div className='pagination' style={{ marginTop: "4rem", width: "100%", display: "flex", justifyContent: "center", gap: "10rem", paddingBottom: "3rem" }}>
                <Button variant="primary" onClick={event => previousPage( event )}>Previous Page</Button>
                <Button variant="primary" onClick={event => nextPage( event )}>Next Page</Button>
            </div>
        </>
    )
}

export default Notes