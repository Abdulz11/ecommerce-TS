import React, { useState } from 'react'
import "@testing-library/jest-dom/vitest";
import {render, screen } from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import { describe,it,expect } from 'vitest'
import Slider from "../src/components/slider"
import Categories from "../src/components/categories"


describe('categories',()=>{
    it('render cloth categories on page',()=>{
        render(<Categories/>)
        const text = screen.getByText(/cloth/i)
        expect(text).toBeInTheDocument()
        
    })
    it('render device categories on page',()=>{
        render(<Categories/>)
        const text = screen.getByText(/device/i)
        expect(text).toBeInTheDocument()
        
    })
    it('render kitchen categories on page',()=>{
        render(<Categories/>)
        const text = screen.getByText(/kitchen/i)
        expect(text).toBeInTheDocument()
        
    })
})


  