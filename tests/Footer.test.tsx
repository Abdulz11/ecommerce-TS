import React, { useState } from 'react'
import "@testing-library/jest-dom/vitest";

import {render, screen } from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import { describe,it,expect } from 'vitest'
import Footer from "../src/components/footer"


describe('slider',()=>{
    it('links should be rendered on the page',()=>{
        render(<Footer/>)

        const instagram = screen.getByText(/insta/i)
        expect(instagram).toBeInTheDocument()

        const twitter = screen.getByText(/twitter/i)
        expect(twitter).toBeInTheDocument()

        const facebook = screen.getByText(/facebook/i)
        expect(facebook).toBeInTheDocument()
        expect(facebook).toBeInTheDocument()
    })
 })



  