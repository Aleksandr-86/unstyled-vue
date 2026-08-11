import { expect, test } from '@playwright/experimental-ct-vue'

import BaseCheckbox from '@/components/base-checkbox/BaseCheckbox.vue'
import type { CheckboxItem } from '@/index.ts'

import FocusScenario from './FocusScenario.vue'
import GroupScenario from './GroupScenario.vue'

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
    await expect(component.getByTestId('first')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(component.locator('input[type="checkbox"]')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(component.locator('input[type="checkbox"]')).not.toBeFocused()
    await expect(component.getByTestId('last')).toBeFocused()
  })

  test('Переключение фокуса клавишей Tab в состоянии disabled', async ({ mount, page }) => {
    const component = await mount(FocusScenario, { props: { disabled: true } })

    await page.keyboard.press('Tab')
    await expect(component.getByTestId('first')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(component.locator('input[type="checkbox"]')).not.toBeFocused()
    await expect(component.getByTestId('last')).toBeFocused()
  })

  test('Переключение фокуса клавишей Tab в состоянии readonly', async ({ mount, page }) => {
    const component = await mount(FocusScenario, { props: { readonly: true } })

    await page.keyboard.press('Tab')
    await expect(component.getByTestId('first')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(component.locator('input[type="checkbox"]')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(component.locator('input[type="checkbox"]')).not.toBeFocused()
    await expect(component.getByTestId('last')).toBeFocused()
  })
})

test.describe('Отображение значения модели при одиночном использовании', () => {
  test.describe('Поле не отмечено', () => {
    test('modelValue: undefined', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: undefined } })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })

    test('modelValue: false, falseValue: false, trueValue: null', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: false, falseValue: false, trueValue: null } })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })

    test('modelValue: null, falseValue: null, trueValue: true', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: null, falseValue: null, trueValue: true } })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })

    test('modelValue: false', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: false } })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })

    test('modelValue: true, falseValue: true, trueValue: false', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: true, falseValue: true, trueValue: false } })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })

    test("modelValue: 'off', falseValue: 'off', trueValue: 'on'", async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: 'off', falseValue: 'off', trueValue: 'on' } })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })

    test('modelValue: 2, falseValue: 2, trueValue: 3', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: 2, falseValue: 2, trueValue: 3 } })
      const input = component.locator('input')

      await expect(input).not.toBeChecked()
    })

    test("modelValue: { id: 3, name: 'apple' }, falseValue: { id: 3, name: 'apple' }, trueValue: { id: 2, name: 'lemon' }", async ({
      mount,
    }) => {
      const component = await mount(BaseCheckbox, {
        props: {
          modelValue: { id: 3, name: 'apple' },
          falseValue: { id: 3, name: 'apple' },
          trueValue: { id: 2, name: 'lemon' },
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

    test('modelValue: null, falseValue: false, trueValue: null', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: null, falseValue: false, trueValue: null } })
      const input = component.locator('input')

      await expect(input).toBeChecked()
    })

    test('modelValue: true, falseValue: null, trueValue: true', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: true, falseValue: null, trueValue: true } })
      const input = component.locator('input')

      await expect(input).toBeChecked()
    })

    test('modelValue: false, falseValue: true, trueValue: false', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: false, falseValue: true, trueValue: false } })
      const input = component.locator('input')

      await expect(input).toBeChecked()
    })

    test("modelValue: 'on', falseValue: 'off', trueValue: 'on'", async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: 'on', falseValue: 'off', trueValue: 'on' } })
      const input = component.locator('input')

      await expect(input).toBeChecked()
    })

    test('modelValue: 3, falseValue: 2, trueValue: 3', async ({ mount }) => {
      const component = await mount(BaseCheckbox, { props: { modelValue: 3, falseValue: 2, trueValue: 3 } })
      const input = component.locator('input')

      await expect(input).toBeChecked()
    })

    test("modelValue: { id: 2, name: 'lemon' }, falseValue: { id: 3, name: 'apple' }, trueValue: { id: 2, name: 'lemon' }", async ({
      mount,
    }) => {
      const component = await mount(BaseCheckbox, {
        props: {
          modelValue: { id: 2, name: 'lemon' },
          falseValue: { id: 3, name: 'apple' },
          trueValue: { id: 2, name: 'lemon' },
        },
      })
      const input = component.locator('input')

      await expect(input).toBeChecked()
    })
  })
})

test.describe('Отображение значения модели при групповом использовании', () => {
  test("modelValue: [], values: ['null', 'apple']", async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: [], values: ['null', 'apple'] } })

    await expect(component.locator('input.first')).not.toBeChecked()
    await expect(component.locator('input.last')).not.toBeChecked()
  })

  test("modelValue: [null], values: ['null', 'apple']", async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: [null], values: ['null', 'apple'] } })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).not.toBeChecked()
  })

  test("modelValue: [apple], values: ['null', 'apple']", async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: ['apple'], values: ['null', 'apple'] } })

    await expect(component.locator('input.first')).not.toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test("modelValue: [null, apple], values: ['null', 'apple']", async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: [null, 'apple'], values: ['null', 'apple'] } })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test("modelValue: [apple, null], values: ['null', 'apple']", async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: ['apple', null], values: ['null', 'apple'] } })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test("modelValue: [], values: ['lemon', 'apple']", async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: [], values: ['lemon', 'apple'] } })

    await expect(component.locator('input.first')).not.toBeChecked()
    await expect(component.locator('input.last')).not.toBeChecked()
  })

  test("modelValue: ['lemon'], values: ['lemon', 'apple']", async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: ['lemon'], values: ['lemon', 'apple'] } })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).not.toBeChecked()
  })

  test("modelValue: ['apple'], values: ['lemon', 'apple']", async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: ['apple'], values: ['lemon', 'apple'] } })

    await expect(component.locator('input.first')).not.toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test("modelValue: ['lemon', 'apple'], values: ['lemon', 'apple']", async ({ mount }) => {
    const component = await mount(GroupScenario, {
      props: { modelValue: ['lemon', 'apple'], values: ['lemon', 'apple'] },
    })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test("modelValue: ['apple', 'lemon'], values: ['lemon', 'apple']", async ({ mount }) => {
    const component = await mount(GroupScenario, {
      props: { modelValue: ['lemon', 'apple'], values: ['lemon', 'apple'] },
    })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test('modelValue: [], values: [2, 3]', async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: [], values: [2, 3] } })

    await expect(component.locator('input.first')).not.toBeChecked()
    await expect(component.locator('input.last')).not.toBeChecked()
  })

  test('modelValue: [2], values: [2, 3]', async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: [2], values: [2, 3] } })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).not.toBeChecked()
  })

  test('modelValue: [3], values: [2, 3]', async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: [3], values: [2, 3] } })

    await expect(component.locator('input.first')).not.toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test('modelValue: [2, 3], values: [2, 3]', async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: [2, 3], values: [2, 3] } })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test('modelValue: [3, 2], values: [2, 3]', async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: [3, 2], values: [2, 3] } })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test('modelValue: [], values: [false, true]', async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: [], values: [false, true] } })

    await expect(component.locator('input.first')).not.toBeChecked()
    await expect(component.locator('input.last')).not.toBeChecked()
  })

  test('modelValue: [true], values: [false, true]', async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: [true], values: [false, true] } })

    await expect(component.locator('input.first')).not.toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test('modelValue: [false], values: [false, true]', async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: [false], values: [false, true] } })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).not.toBeChecked()
  })

  test('modelValue: [false, true], values: [false, true]', async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: [false, true], values: [false, true] } })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test('modelValue: [true, false], values: [false, true]', async ({ mount }) => {
    const component = await mount(GroupScenario, { props: { modelValue: [true, false], values: [false, true] } })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test("modelValue: [], values: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }]", async ({ mount }) => {
    const component = await mount(GroupScenario, {
      props: {
        modelValue: [],
        values: [
          { id: 2, name: 'lemon' },
          { id: 3, name: 'apple' },
        ],
      },
    })

    await expect(component.locator('input.first')).not.toBeChecked()
    await expect(component.locator('input.last')).not.toBeChecked()
  })

  test("modelValue: [{ id: 2, name: 'lemon' }], values: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }]", async ({
    mount,
  }) => {
    const component = await mount(GroupScenario, {
      props: {
        modelValue: [{ id: 2, name: 'lemon' }],
        values: [
          { id: 2, name: 'lemon' },
          { id: 3, name: 'apple' },
        ],
      },
    })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).not.toBeChecked()
  })

  test("modelValue: [{ id: 3, name: 'apple' }], values: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }]", async ({
    mount,
  }) => {
    const component = await mount(GroupScenario, {
      props: {
        modelValue: [{ id: 3, name: 'apple' }],
        values: [
          { id: 2, name: 'lemon' },
          { id: 3, name: 'apple' },
        ],
      },
    })

    await expect(component.locator('input.first')).not.toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test("modelValue: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }], values: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }]", async ({
    mount,
  }) => {
    const component = await mount(GroupScenario, {
      props: {
        modelValue: [
          { id: 2, name: 'lemon' },
          { id: 3, name: 'apple' },
        ],
        values: [
          { id: 2, name: 'lemon' },
          { id: 3, name: 'apple' },
        ],
      },
    })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test("modelValue: [{ id: 3, name: 'apple' }, { id: 2, name: 'lemon' }], values: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }]", async ({
    mount,
  }) => {
    const component = await mount(GroupScenario, {
      props: {
        modelValue: [
          { id: 3, name: 'apple' },
          { id: 2, name: 'lemon' },
        ],
        values: [
          { id: 2, name: 'lemon' },
          { id: 3, name: 'apple' },
        ],
      },
    })

    await expect(component.locator('input.first')).toBeChecked()
    await expect(component.locator('input.last')).toBeChecked()
  })

  test("modelValue: [{ id: 5, name: 'wrong data' }], values: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }]", async ({
    mount,
  }) => {
    const component = await mount(GroupScenario, {
      props: {
        modelValue: [{ id: 5, name: 'wrong' }],
        values: [
          { id: 2, name: 'lemon' },
          { id: 3, name: 'apple' },
        ],
      },
    })

    await expect(component.locator('input.first')).not.toBeChecked()
    await expect(component.locator('input.last')).not.toBeChecked()
  })

  test("modelValue: [{ id: 5, name: 'wrong' }, { id: 7, name: 'data' }], values: [{ id: 2, name: 'lemon' }, { id: 3, name: 'apple' }]", async ({
    mount,
  }) => {
    const component = await mount(GroupScenario, {
      props: {
        modelValue: [
          { id: 5, name: 'wrong' },
          { id: 7, name: 'data' },
        ],
        values: [
          { id: 2, name: 'lemon' },
          { id: 3, name: 'apple' },
        ],
      },
    })

    await expect(component.locator('input.first')).not.toBeChecked()
    await expect(component.locator('input.last')).not.toBeChecked()
  })
})

test.describe('Генерация событий при одиночном использовании', () => {
  test.describe('Событие click при нажатии ЛКМ на метку поля', () => {
    test('В обычном состоянии => генерируется 1 раз', async ({ mount }) => {
      const emittedEvents: PointerEvent[] = []

      const component = await mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Согласен с условием' },
        on: { click: (value: PointerEvent) => emittedEvents.push(value) },
      })

      await component.getByText('Согласен с условием').click()
      expect(emittedEvents).toEqual([expect.any(Object)])
    })

    test('В состоянии readonly => не генерируется', async ({ mount }) => {
      const emittedEvents: PointerEvent[] = []

      const component = await mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Согласен с условием', readonly: true },
        on: { click: (value: PointerEvent) => emittedEvents.push(value) },
      })

      await component.getByText('Согласен с условием').click()
      expect(emittedEvents).toEqual([])
    })
  })

  test.describe('Событие click при нажатии ЛКМ на поле', () => {
    test('В обычном состоянии => генерируется 1 раз', async ({ mount }) => {
      const emittedEvents: PointerEvent[] = []

      const component = await mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Согласен с условием' },
        on: { click: (value: PointerEvent) => emittedEvents.push(value) },
      })

      await component.locator('input[type="checkbox"]').click()
      expect(emittedEvents).toEqual([expect.any(Object)])
    })

    test('В состоянии readonly => не генерируется', async ({ mount }) => {
      const emittedEvents: PointerEvent[] = []

      const component = await mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Согласен с условием', readonly: true },
        on: { click: (value: PointerEvent) => emittedEvents.push(value) },
      })

      await component.locator('input[type="checkbox"]').click()
      expect(emittedEvents).toEqual([])
    })
  })

  test.describe('Событие update:modelValue при нажатии ЛКМ на метку поля в обычном состоянии', () => {
    test.describe('Поле не отмечено', () => {
      test('modelValue: undefined => true, генерируется 1 раз', async ({ mount }) => {
        const emittedEvents: CheckboxItem[] = []

        const component = await mount(BaseCheckbox, {
          props: { modelValue: undefined, label: 'Согласен с условием' },
          on: { 'update:modelValue': (value: CheckboxItem) => emittedEvents.push(value) },
        })

        await component.getByText('Согласен с условием').click()
        expect(emittedEvents).toEqual([true])
      })

      test('modelValue: false, falseValue: false, trueValue: null => null, генерируется 1 раз', async ({ mount }) => {
        const emittedEvents: CheckboxItem[] = []

        const component = await mount(BaseCheckbox, {
          props: { modelValue: false, falseValue: false, trueValue: null, label: 'Согласен с условием' },
          on: { 'update:modelValue': (value: CheckboxItem) => emittedEvents.push(value) },
        })

        await component.getByText('Согласен с условием').click()
        expect(emittedEvents).toEqual([null])
      })

      test('modelValue: null, falseValue: null, trueValue: true => true, генерируется 1 раз', async ({ mount }) => {
        const emittedEvents: CheckboxItem[] = []

        const component = await mount(BaseCheckbox, {
          props: { modelValue: null, falseValue: null, trueValue: true, label: 'Согласен с условием' },
          on: { 'update:modelValue': (value: CheckboxItem) => emittedEvents.push(value) },
        })

        await component.getByText('Согласен с условием').click()
        expect(emittedEvents).toEqual([true])
      })

      test('modelValue: true, falseValue: true, trueValue: false => false, генерируется 1 раз', async ({ mount }) => {
        const emittedEvents: CheckboxItem[] = []

        const component = await mount(BaseCheckbox, {
          props: { modelValue: true, falseValue: true, trueValue: false, label: 'Согласен с условием' },
          on: { 'update:modelValue': (value: CheckboxItem) => emittedEvents.push(value) },
        })

        await component.getByText('Согласен с условием').click()
        expect(emittedEvents).toEqual([false])
      })
    })
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
