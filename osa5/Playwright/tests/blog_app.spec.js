const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {
    
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Batman',
        username: 'Batman',
        password: 'salisss'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    await expect(page.getByRole('textbox')).toHaveCount(2)
  })
    describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      
      await page.getByTestId('username').fill('Batman')
      await page.getByTestId('password').fill('salisss')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Batman logged in successfully')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('Batman')
      await page.getByTestId('password').fill('qwerty')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(
        page.getByText('wrong username or password!')).toBeVisible()
    })
 
  
    test('a new blog can be created', async ({ page }) => {
     await page.getByTestId('username').fill('Batman')
     await page.getByTestId('password').fill('salisss')
     await page.getByRole('button', { name: 'login' }).click()
      await page.getByTestId('toggle').click()
      const inputs = page.getByRole('textbox')
    
      await inputs.nth(0).fill('Batmanin seikkailut')
      await inputs.nth(1).fill('Batman')
      await inputs.nth(2).fill('www.seikkailut.fi')
      await page.getByRole('button', { name: 'create' }).click()

      await expect( page.getByText('Batmanin seikkailut Batman').first()).toBeVisible()
    })
    
    test('like-button works', async ({ page }) => {
        await page.getByTestId('username').fill('Batman')
     await page.getByTestId('password').fill('salisss')
     await page.getByRole('button', { name: 'login' }).click()
    await page.getByTestId('toggle').click()
    const inputs = page.getByRole('textbox')
    
      await inputs.nth(0).fill('Batmanin seikkailut')
      await inputs.nth(1).fill('Batman')
      await inputs.nth(2).fill('www.seikkailut.fi')
      await page.getByRole('button', { name: 'create' }).click()

    await expect( page.getByText('Batmanin seikkailut Batman').first()).toBeVisible()
    await page.getByTestId('view').first().click()
    await page.getByTestId('like').first().click()
  })
})
})
