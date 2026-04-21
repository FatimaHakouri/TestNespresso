// @ts-check
import { test, expect } from '@playwright/test';
import { assert } from 'node:console';

test('add a capsule to cart', async ({ page }) => {
    await page.goto('https://www.nespresso.com/fr/en/order/capsules/original');

    //Test the title 
    await expect(page).toHaveTitle(/Nespresso/);

    //await page.pause();

    //Cookies
    await page.locator('#onetrust-accept-btn-handler').click();


    //CSS Selector 
    //const addToBagButton = page.locator('button[data-qa="Roma"]');

    const addToBagButton = page.locator('xpath=//button[@data-qa="Roma"]');

    const quantityInput = page.locator("xpath =//input[@id='ta-quantity-selector__custom-field']");
    const qty = "10";

    const okButton = page.locator("xpath =//button[@id='ta-quantity-selector__custom-ok']");

    const cartButton = page.locator("xpath =//button[@id='ta-mini-basket__open' and contains(@class, 'not-empty')]");

    const selectedQuantity = page.locator("xpath =//div[contains(@class,'MiniBasketItem__addToBagButton')]//button[@data-qa='Roma']//div[@class='AddToBagButtonSmall__quantity']");

    const checkoutButton = page.locator("xpath =//*[@id='ta-mini-basket__checkout']");



    //A cause du lazy loading il faut faire un scroll
    //!!!!!! Ces 2 methodes ne marchent pas
    //await addToBagButton.scrollIntoViewIfNeeded();
    //await addToBagButton.evaluate(node => node.scrollIntoView({ block: "center", inline: "nearest" }));

    let isFound = false;
    for (let i = 0; i < 15; i++) {
        if (await addToBagButton.isVisible()) {
            isFound = true;
            break;
        }
        // Scroll de 600px comme dans votre script Selenium
        await page.mouse.wheel(0, 700);
        // Petit délai pour laisser le JS charger les produits
        await page.waitForTimeout(700);
    }

    if (!isFound) {
        throw new Error("Le produit Roma est introuvable apres scroll.");
    }
    await expect(addToBagButton).toBeVisible();
    await addToBagButton.click();


    await expect(quantityInput).toBeVisible();
    await quantityInput.fill(qty);
    //await page.pause();

    await okButton.click();

    //il faut attendre l'actualisation du panier
    //!!!!! does not work
    //await page.waitForTimeout(1000);

    //await expect(cartButton).toHaveClass(/not-empty/, { timeout: 10000 });
    await cartButton.click();
    //await page.pause();


    await expect(selectedQuantity).toBeVisible();
    await expect(selectedQuantity).toHaveText(qty);

    await expect(checkoutButton).toBeVisible();
    await expect(checkoutButton).toBeEnabled();
    await checkoutButton.click();

    await expect(page).toHaveTitle(/Login/);
    await expect(page).toHaveURL("https://www.nespresso.com/fr/en/secure/login?destination-redirect=/fr/en/checkoutMode");

});