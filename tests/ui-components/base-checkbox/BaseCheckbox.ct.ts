import { expect, test } from '@playwright/experimental-ct-vue'

import BaseCheckbox from '@/components/base-checkbox/BaseCheckbox.vue'

import FocusScenario from './FocusScenario.vue'

test.describe('Базовая отрисовка', () => {
  test('отрисовывает заданный текст метки', async ({ mount }) => {
    const component = await mount(BaseCheckbox, {
      props: { label: 'Согласен с условиями' },
    })

    await expect(component).toContainText('Согласен с условиями')
  })

  test('применяет пользовательские классы параметра classes', async ({ mount }) => {
    const component = await mount(BaseCheckbox, {
      props: {
        label: 'Тест классов',
        classes: {
          root: 'custom-root',
          input: 'custom-input',
          label: 'custom-label',
        },
      },
    })

    await expect(component).toHaveClass(/^custom-root/)
    await expect(component.locator('input')).toHaveClass(/^custom-input/)
    await expect(component.locator('span')).toHaveClass(/^custom-label/)
  })

  test('применяет атрибуты к элементу input', async ({ mount }) => {
    const component = await mount(BaseCheckbox)
    const input = component.locator('input')

    await expect(input).not.toHaveAttribute('aria-describedby')
    await expect(input).not.toHaveAttribute('aria-invalid')
    await expect(input).not.toHaveAttribute('aria-label')
    await expect(input).not.toBeDisabled()
    await expect(input).not.toHaveAttribute('name')
    await expect(input).not.toHaveAttribute('aria-readonly', 'true')
    await expect(input).not.toHaveAttribute('required')
    await expect(input).not.toHaveAttribute('value')

    await component.update({
      props: {
        ariaDescribedby: 'accept_hint',
        ariaInvalid: true,
        ariaLabel: 'Согласие с условием оферты',
        disabled: true,
        name: 'accept_terms',
        readonly: true,
        required: true,
        value: 'accepted',
      },
    })

    await expect(input).toHaveAttribute('aria-describedby', 'accept_hint')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAttribute('aria-label', 'Согласие с условием оферты')
    await expect(input).toBeDisabled()
    await expect(input).toHaveAttribute('name')
    await expect(input).toHaveAttribute('aria-readonly', 'true')
    await expect(input).toHaveAttribute('required')
    await expect(input).toHaveAttribute('value')
  })
})

test.describe('Фокус и доступность', () => {
  test('Получает фокус при нажатии ЛКМ на метку поля в обычном состоянии', async ({ mount }) => {
    const component = await mount(BaseCheckbox, { props: { label: 'Согласен у условием' } })
    const input = component.locator('input')

    await component.getByText('Согласен у условием').click()
    await expect(input).toBeFocused()
  })

  test('Не получает фокус при нажатии ЛКМ на метку поля в состоянии disabled', async ({ mount }) => {
    const component = await mount(BaseCheckbox, { props: { disabled: true, label: 'Согласен у условием' } })
    const input = component.locator('input')

    await component.getByText('Согласен у условием').click({ force: true })
    await expect(input).not.toBeFocused()
  })

  test('Получает фокус при нажатии ЛКМ на метку поля в состоянии readonly', async ({ mount }) => {
    const component = await mount(BaseCheckbox, { props: { label: 'Согласен у условием', readonly: true } })
    const input = component.locator('input')

    await component.getByText('Согласен у условием').click()
    await expect(input).toBeFocused()
  })

  test('Получает фокус при нажатии на поле в обычном состоянии', async ({ mount }) => {
    const component = await mount(BaseCheckbox, { props: { label: 'Согласен у условием' } })
    const input = component.locator('input')

    await input.click()
    await expect(input).toBeFocused()
  })

  test('Не получает фокус при нажатии на поле в состоянии disabled', async ({ mount }) => {
    const component = await mount(BaseCheckbox, { props: { label: 'Согласен у условием', disabled: true } })
    const input = component.locator('input')

    await input.click({ force: true })
    await expect(input).not.toBeFocused()
  })

  test('Получает фокус при нажатии на поле в состоянии readonly', async ({ mount }) => {
    const component = await mount(BaseCheckbox, { props: { label: 'Согласен у условием', readonly: true } })
    const input = component.locator('input')

    await input.click()
    await expect(input).toBeFocused()
  })

  test('Переключение фокуса клавишей Tab в обычном состоянии', async ({ mount, page }) => {
    const component = await mount(FocusScenario)

    await page.keyboard.press('Tab')
    await expect(component.getByTestId('first-input')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(component.locator('input[type="checkbox"]')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(component.locator('input[type="checkbox"]')).not.toBeFocused()
    await expect(component.getByTestId('second-input')).toBeFocused()
  })

  test('Переключение фокуса клавишей Tab в состоянии disabled', async ({ mount, page }) => {
    const component = await mount(FocusScenario, { props: { disabled: true } })

    await page.keyboard.press('Tab')
    await expect(component.getByTestId('first-input')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(component.locator('input[type="checkbox"]')).not.toBeFocused()
    await expect(component.getByTestId('second-input')).toBeFocused()
  })

  test('Переключение фокуса клавишей Tab в состоянии readonly', async ({ mount, page }) => {
    const component = await mount(FocusScenario, { props: { readonly: true } })

    await page.keyboard.press('Tab')
    await expect(component.getByTestId('first-input')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(component.locator('input[type="checkbox"]')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(component.locator('input[type="checkbox"]')).not.toBeFocused()
    await expect(component.getByTestId('second-input')).toBeFocused()
  })
})

test.describe('Слоты', () => {
  test('Отрисовывает содержимое слота по умолчанию вместо текста параметра label', async ({ mount }) => {
    const component = await mount(BaseCheckbox, {
      props: { label: 'Текст метки' },
      slots: { default: 'Текст слота по умолчанию' },
    })

    await expect(component).not.toContainText('Текст метки')
    await expect(component).toContainText('Текст слота по умолчанию')
  })

  test('Отрисовывает содержимое именованного слота control', async ({ mount }) => {
    const component = await mount(BaseCheckbox, {
      slots: { control: '<div class="custom-indicator"></div>' },
    })

    await expect(component.locator('.custom-indicator')).toBeAttached()
  })
})

test.describe('Правильно отображает значение модели при одиночном использовании', () => {
  test.describe('Поле не отмечено', () => {
    test('modelValue: undefined', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: undefined } })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })

    test('modelValue: false, trueValue: null, falseValue: false', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: false, trueValue: null, falseValue: false } })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })

    test('modelValue: null, trueValue: true, falseValue: null', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: null, trueValue: true, falseValue: null } })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })

    test('modelValue: false', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: false } })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })

    test('modelValue: true, trueValue: false, falseValue: true', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: true, trueValue: false, falseValue: true } })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })

    test('modelValue: "off", trueValue: "on", falseValue: "off"', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: 'off', trueValue: 'on', falseValue: 'off' } })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })

    test('modelValue: 3, trueValue: 2, falseValue: 3', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: 3, trueValue: 2, falseValue: 3 } })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })

    test.only('modelValue: { id: 3, name: "apple" }, trueValue: { id: 2, name: "lemon" }, falseValue: { id: 3, name: "apple" }', async ({
      mount,
    }) => {
      const component = await mount(BaseCheckbox, {
        props: {
          modelValue: { id: 3, name: 'apple' },
          trueValue: { id: 2, name: 'lemon' },
          falseValue: { id: 3, name: 'apple' },
        },
      })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })
  })

  test.describe('Поле отмечено', () => {
    test('modelValue: true', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: true } })
      const input = component.locator('input')

      await expect(input).toBeChecked()
    })

    test('modelValue: null, trueValue: null, falseValue: false', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: null, trueValue: null, falseValue: false } })
      const input = component.locator('input')

      await expect(input).toBeChecked()
    })

    test('modelValue: true, trueValue: true, falseValue: null', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: true, trueValue: true, falseValue: null } })
      const input = component.locator('input')

      await expect(input).toBeChecked()
    })

    test('modelValue: false, trueValue: false, falseValue: true', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: false, trueValue: false, falseValue: true } })
      const input = component.locator('input')

      await expect(input).toBeChecked()
    })

    test('modelValue: "on", trueValue: "on", falseValue: "off"', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: 'on', trueValue: 'on', falseValue: 'off' } })
      const input = component.locator('input')

      await expect(input).toBeChecked()
    })

    test('modelValue: 2, trueValue: 2, falseValue: 3', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: 2, trueValue: 2, falseValue: 3 } })
      const input = component.locator('input')

      await expect(input).toBeChecked()
    })

    test('modelValue: { id: 2, name: "lemon" }, trueValue: { id: 2, name: "lemon" }, falseValue: { id: 3, name: "apple" }', async ({
      mount,
    }) => {
      const component = await mount(BaseCheckbox, {
        props: {
          modelValue: { id: 2, name: 'lemon' },
          trueValue: { id: 2, name: 'lemon' },
          falseValue: { id: 3, name: 'apple' },
        },
      })
      const input = component.locator('input')

      await expect(input).toBeChecked()
    })
  })
})
