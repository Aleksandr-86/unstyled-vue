import { expect, test } from '@playwright/experimental-ct-vue'

import VInput from '../VInput.vue'

test('Первоначальная проверка', async ({ mount }) => {
  const component = await mount(VInput, { props: { type: 'text' } })
  await expect(component).toHaveAttribute('type', 'text')
})
