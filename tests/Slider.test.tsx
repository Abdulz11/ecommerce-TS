import React, { useState } from 'react'
import "@testing-library/jest-dom/vitest";

import {render, screen } from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import { describe,it,expect } from 'vitest'
import Slider from "../src/components/slider"


describe('slider',()=>{
    it('image slider should be rendered on the page',()=>{
        render(<Slider/>)
        const title = screen.getAllByRole('paragraph')
        expect(title[0]).toBeInTheDocument()
    })
    it('button on slider should be present',()=>{
        render(<Slider/>)
        const title = screen.getAllByRole('button')
        expect(title[0]).toBeInTheDocument()
    })
})


  