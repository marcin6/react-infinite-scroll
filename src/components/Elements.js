import React, { useState, useEffect, useCallback } from 'react';
import { styles } from './Styles';

export default function Elements() {
    const [elements, setElements] = useState([]);
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState();
    const url = 'https://reqres.in/api/users?page=' + count;

    const increment = () => setCount(c => {
        if (c >= 2) return c;
        return c + 1;
    });

    const decrement = () => setCount(c => {
        if (c <= 1) return c;
        return c - 1;
    });;

    const getElements = useCallback(() => {
        fetch(url)
            .then(res => res.json())
            .then(result =>
                setElements(prevState => ([...prevState, ...result.data])),
                setLoading(false)
            )
    }, [url])

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
        setLoading(true);
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

    useEffect(() => {
        if (!loading)  return;
        getElements();
    }, [loading, getElements]); 
    
    useEffect(() => {
        setElements([]);
        getElements();
    }, [count, getElements])


    return (
        <div className="main-container" style={styles.mainContainer} >
            <h2 style={styles.header}>Infinite scroll</h2>
            <div className="btn-container" style={styles.btnContainer}>
                <button onClick={decrement} style={styles.btn} >Prev</button>
                <button onClick={increment} style={styles.btn}>Next</button>
            </div>
            <div className="page-container" style={styles.pageContainer}>
                <div>Page-</div>
                <div>{count}</div>
            </div>
            <table style={styles.table}>
                <thead>
                    <tr style={styles.tr}>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>First Name</th>
                        <th style={styles.th}>Last Name</th>
                        <th style={styles.th}>Avatar</th>
                    </tr>
                </thead>
                {elements.map((element, idx) =>
                    <tbody key={idx} >
                        <tr style={styles.tr}>
                            <td>{element.id}</td>
                            <td>{element.email}</td>
                            <td>{element.first_name}</td>
                            <td>{element.last_name}</td>
                            <td><img src={element.avatar} alt=""/></td>
                        </tr>
                    </tbody>)}
            </table>
            {loading && <div style={styles.loader}><span >Loading ...</span></div>}
        </div>
    )
}