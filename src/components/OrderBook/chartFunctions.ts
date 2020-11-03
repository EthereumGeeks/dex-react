import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesSpiritedaway from '@amcharts/amcharts4/themes/spiritedaway'

import { safeTokenName } from 'utils'

import { TokenDetails, Network } from 'types'
import { getNetworkFromId } from '@gnosis.pm/dex-js'

const ZOOM_BUTTON_CONTAINER_ID = 'zoomButtonContainer'

export function disableGrip(grip: am4core.ResizeButton): void {
  // Remove default grip image
  grip.icon.disabled = true

  // Disable background
  grip.background.disabled = true
}

export const createChart = (chartElement: HTMLElement): am4charts.XYChart => {
  am4core.useTheme(am4themesSpiritedaway)
  am4core.options.autoSetClassName = true
  const chart = am4core.create(chartElement, am4charts.XYChart)

  // Colors
  const colors = {
    green: '#3d7542',
    red: '#dc1235',
  }

  // Create axes
  const xAxis = chart.xAxes.push(new am4charts.ValueAxis())
  // Making the scale start with the first value, without empty spaces
  // https://www.amcharts.com/docs/v4/reference/valueaxis/#strictMinMax_property
  xAxis.strictMinMax = true
  // How small we want the column separators be, in pixels
  // https://www.amcharts.com/docs/v4/reference/axisrendererx/#minGridDistance_property
  // xAxis.renderer.minGridDistance = 40

  // To start zoomed in when data loads
  // https://www.amcharts.com/docs/v4/reference/valueaxis/#keepSelection_property
  xAxis.keepSelection = true
  // To allow we to zoom reaaaaly tiny fractions
  xAxis.maxZoomFactor = 10 ** 18

  const yAxis = chart.yAxes.push(new am4charts.ValueAxis())

  yAxis.keepSelection = true
  yAxis.maxZoomFactor = 10 ** 18

  // Create series
  const bidSeries = chart.series.push(new am4charts.StepLineSeries())
  bidSeries.name = 'Bid Series'
  bidSeries.dataFields.valueX = 'priceNumber'
  bidSeries.dataFields.valueY = 'bidValueY'
  bidSeries.strokeWidth = 1
  bidSeries.stroke = am4core.color(colors.green)
  bidSeries.fill = bidSeries.stroke
  bidSeries.fillOpacity = 0.1

  const askSeries = chart.series.push(new am4charts.StepLineSeries())
  askSeries.name = 'Ask Series'
  askSeries.dataFields.valueX = 'priceNumber'
  askSeries.dataFields.valueY = 'askValueY'
  askSeries.strokeWidth = 1
  askSeries.stroke = am4core.color(colors.red)
  askSeries.fill = askSeries.stroke
  askSeries.fillOpacity = 0.1

  // Add cursor
  chart.cursor = new am4charts.XYCursor()
  // Make the cursor visible for Value series
  chart.cursor.snapToSeries = [bidSeries, askSeries]

  // Scrollbar
  const scrollbarX = new am4charts.XYChartScrollbar()
  // Show minimap stype
  scrollbarX.series.push(bidSeries)
  scrollbarX.series.push(askSeries)
  // Disable grips
  disableGrip(scrollbarX.startGrip)
  disableGrip(scrollbarX.endGrip)
  // Min width of the thumb area
  scrollbarX.thumb.minWidth = 10

  chart.scrollbarX = scrollbarX

  // Zoom buttons container
  const buttonContainer = chart.plotContainer.createChild(am4core.Container)
  buttonContainer.shouldClone = false
  buttonContainer.align = 'center'
  buttonContainer.valign = 'top'
  buttonContainer.zIndex = Number.MAX_SAFE_INTEGER
  buttonContainer.marginTop = 5
  buttonContainer.layout = 'horizontal'
  buttonContainer.id = ZOOM_BUTTON_CONTAINER_ID

  // Disabling default zoom out button
  chart.zoomOutButton.disabled = true

  return chart
}

/**
 * Just because TS won't let me do this directly...
 *
 * @param optionalLabel optional label
 * @param text label text
 */
export function setLabel(optionalLabel: am4core.Optional<am4core.Label>, text: string): void {
  if (optionalLabel) {
    optionalLabel.text = text
  }
}

export function getZoomButtonContainer(chart: am4charts.XYChart): am4core.Container | undefined {
  return Array.from(chart.plotContainer.children).find(({ id }) => id === ZOOM_BUTTON_CONTAINER_ID) as am4core.Container
}

export interface DrawLabelsParams {
  chart: am4charts.XYChart
  baseToken: TokenDetails
  quoteToken: TokenDetails
  networkId: number
}

export const drawLabels = ({ chart, baseToken, quoteToken, networkId }: DrawLabelsParams): void => {
  const baseTokenLabel = safeTokenName(baseToken)
  const quoteTokenLabel = safeTokenName(quoteToken)
  const market = baseTokenLabel + '-' + quoteTokenLabel

  const networkDescription = networkId !== Network.Mainnet ? `${getNetworkFromId(networkId)} ` : ''

  const [xAxis] = chart.xAxes
  const [yAxis] = chart.yAxes

  xAxis.title.text = `${networkDescription} Price (${quoteTokenLabel})`
  yAxis.title.text = baseTokenLabel

  const [bidSeries, askSeries] = chart.series

  bidSeries.tooltipText = `[bold]${market}[/]\nBid Price: [bold]{priceFormatted}[/] ${quoteTokenLabel}\nVolume: [bold]{totalVolumeFormatted}[/] ${baseTokenLabel}`
  askSeries.tooltipText = `[bold]${market}[/]\nAsk Price: [bold]{priceFormatted}[/] ${quoteTokenLabel}\nVolume: [bold]{totalVolumeFormatted}[/] ${baseTokenLabel}`
}
