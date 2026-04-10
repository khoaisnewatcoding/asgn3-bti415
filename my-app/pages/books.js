/********************************************************************************* 
*  BTI425 – Assignment 1 
* 
*  I declare that this assignment is my own work in accordance with Seneca's 
*  Academic Integrity Policy: 
*  
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html 
*  
*  Name: Hoang Dang Khoa Nguyen Student ID: 178143236 Date: Feb 13th 2026
* 
********************************************************************************/

import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import Pagination from "react-bootstrap/Pagination";
import Table from "react-bootstrap/Table";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Books() {
    const [page, setPage] = useState(1);
    const [pageData, setPageData] = useState([]);
    const router = useRouter();
    const queryEntries = Object.entries(router.query);
    let queryString = { ...router.query };
    let qParts = [];

    Object.entries(queryString).forEach(([key, value]) => {
        qParts.push(`${key}:${value}`);
    });

    if (qParts.length > 0) {
        queryString = qParts.join(' AND ');
    }

    const searchSummary = queryEntries
        .map(([key, value]) => `${key}: ${value}`)
        .join(" | ");

    const { data, error } = useSWR(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(queryString)}&page=${page}&limit=10`
    );

    useEffect(() => {
        if (data) setPageData(data);
    }, [data]);

    const previous = () => {
        if (page > 1) setPage(page - 1);
    };
    const next = () => {
        setPage(page + 1);
    };

    return (
        <>
            <PageHeader
                text="Search Results"
                subtext={searchSummary}
            />
            {error && <p>Error loading books.</p>}
            <Table striped hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>First Published</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.docs && pageData.docs.length > 0 ? (
                        pageData.docs.map((book, idx) => (
                            <tr
                                key={idx}
                                style={{ cursor: "pointer" }}
                                onClick={() => router.push(book.key)}
                            >
                                <td>{book.title}</td>
                                <td>{book.first_publish_year || "N/A"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2}>No books found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Pagination>
                <Pagination.Prev onClick={previous} />
                <Pagination.Item>{page}</Pagination.Item>
                <Pagination.Next onClick={next} />
            </Pagination>
        </>
    );
}