import React, { useEffect, useState } from "react";
import Head from 'next/head';
import Modal from 'react-modal';
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import "react-awesome-slider/dist/captioned.css";
import styles from '../styles/Home.module.css';

const headerStyle = {
    color: 'white',
    position: "absolute",
    zIndex: 4,
    top: '30%',
    left: '40%'
}

const contentStyle = {
    color: 'white',
    textAlign: "center",
    top: '50%',
    left: '25%',
    position: "absolute",
    zIndex: 4
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 999999,
        color : 'black',
    },
};

const bgImg = {
    position: "fixed",
    zIndex: 3,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%"
};

function sendEmail(email) {
    const body = `Здравствуйте, я нашел вашего питомца.%0A-----------%0AС уважением, ${localStorage.user}`;
    window.open(`mailto:${email}?subject=Потерянный зверь&body=${body}`);
}

function Animal(props) {
    if (!props.data) return <p>Loading</p>
    const {header, content, img} = props.data;
    return (
        <div>
            <h1 style={headerStyle}>{header}</h1> <br/>
            <h2 style={contentStyle}>{content}</h2>
            <img
                style={bgImg}
                alt="Чара (моя собака)"
                src={img}
            />
        </div>
    );
}

function Slider() {
    const [animals, setAnimals] = React.useState([]);
    React.useEffect(() => {
        fetch('/animals.json').then(data => data.json()).then(data => setAnimals(data));
    }, []);
    return(
    <AwesomeSlider style={{"--slider-height-percentage": "100%", zIndex: 0}}>
    {
            animals.map((data, i) => <div key={i} style={{zIndex: 0}}
                                      onClick={() => sendEmail(data?.email)}>
            <Animal data={data}/>
        </div>)
    }
    </AwesomeSlider>);
}

function ModalWindow() {
    const [name, setName] = React.useState('');
    const [age, setAge] = React.useState('');
    const [breed, setBreed] = React.useState('');
    const [image, setImage] = React.useState(null);
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function closeModal() {
        window.location.reload();
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const uploadToServer = async (event) => {
        const body = new FormData();
        body.set("name", name);
        body.set("age", age);
        body.set("breed", breed);
        body.append("file", image);
        console.log("sending")
        const response = await fetch("/api/fileupload", {
          method: "POST",
          body
        });
    };

    const setFileToImage = (event) => {
        if (event.target.files && event.target.files[0]) {
          const i = event.target.files[0];
          setImage(i);
        }
    }
    
    return(
        <div>
            <button onClick={openModal}>Add animal</button>
            <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            >
            <button onClick={closeModal}>Close</button>
                <form onSubmit={uploadToServer} className={styles.form}>
                    <p>Name:</p>
                    <input
                        id="name"
                        type="text"
                        onChange={e => setName(e.target.value)}
                    />
                    <p>Age:</p>
                    <input
                        id="age"
                        type="text"
                        onChange={e => setAge(e.target.value)}
                    />
                    <p>Breed:</p>
                    <textarea
                        id="breed"
                        type="text"
                        rows="4"
                        onChange={e => setBreed(e.target.value)}
                    />
                    <input
                        type="file"
                        name="myImage"
                        onChange={setFileToImage}
                    ></input>
                    <button type="submit">Send</button>
                </form>
            </Modal>
        </div>
    )
}

export default function Home() {
    React.useEffect(() => {
        let user = localStorage.getItem('user');
        if (user === null) {
            while (user === null) {
                user = prompt("Введите ваше имя пользователя");
                if (!user) {
                    alert('Обязательно!');
                } else {
                    localStorage.setItem('user', user);
                }
            }
        }
    }, []);

    function logout() {
        localStorage.clear();
        location.reload();
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Petto</title>
                <meta name="description" content="Социальная сеть для питомцев"/>
                <link rel="icqon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                <ModalWindow/>
                <button onClick={logout}>logout</button>
                <h1>Petto</h1> 
                <Slider/>   
            </main> 


            <footer className={styles.footer}>
                Petto, (c) 2022
            </footer>
        </div>
    )
}
