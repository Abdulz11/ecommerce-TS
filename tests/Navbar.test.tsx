import React, { useState } from 'react'
import "@testing-library/jest-dom/vitest";

import {render, screen } from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import { describe,it,expect } from 'vitest'
import Navbar from "../src/components/navbar"


describe('navbar',()=>{
    it('navbar  should be rendered on the page',()=>{
        render(<Navbar/>)
        const title = screen.getAllByRole('paragraph')
        expect(title[0]).toBeInTheDocument()
    })
   it('cart link ',()=>{
    const link = screen.getByRole('link')
    expect(link[2]).toHaveAttribute('href','/cart')
   })
//    it('cart number item should display zero initial render ',()=>{
//     const link = screen.query()
//     expect(link[0]).toHaveAttribute('href','/cart')
//    })
})


  