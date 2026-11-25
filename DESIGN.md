---
version: alpha
name: 출장여비 계산기
description: 건축 사진의 대각선 구도와 시안 프레임을 바탕으로 한 오프라인 계산기 디자인 지침
colors:
  primary: "#079BE5"
  on-primary: "#101E2D"
  primary-deep: "#00618C"
  hero-ink: "#020106"
  hero-navy: "#26385E"
  hero-blue: "#346287"
  dark-surface: "#1C1C1C"
  on-dark: "#F4F6F8"
  surface: "#FFFFFF"
  canvas: "#F8F8F8"
  on-surface: "#1C1C1C"
  muted: "#52616F"
  control-border: "#828E99"
  divider: "#D2D2D2"
  error: "#A32222"
typography:
  headline-display:
    fontFamily: 'Malgun Gothic, Apple SD Gothic Neo, system-ui, sans-serif'
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.16
    letterSpacing: -0.03em
  headline-section:
    fontFamily: 'Malgun Gothic, Apple SD Gothic Neo, system-ui, sans-serif'
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.3
  result-amount:
    fontFamily: 'Malgun Gothic, Apple SD Gothic Neo, system-ui, sans-serif'
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.2
    fontFeature: '"tnum"'
  body-md:
    fontFamily: 'Malgun Gothic, Apple SD Gothic Neo, system-ui, sans-serif'
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: 'Malgun Gothic, Apple SD Gothic Neo, system-ui, sans-serif'
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.45
  sm:
    headline-display:
      fontSize: 32px
      fontWeight: 600
      lineHeight: 1.2
rounded:
  none: 0px
  sm: 4px
  md: 8px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  max-width: 1120px
motion:
  state-change:
    duration: 120ms
    timingFunction: ease-out
components:
  button-primary:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    height: 44px
  button-help:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.on-dark}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    height: 44px
  result-panel:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  form-section:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: "{spacing.lg}"
  help-dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
---

# 출장여비 계산기 디자인

## Overview

첨부 이미지에서 가장 두드러지는 요소는 유리 건물의 대각선, 짙은 블루 사진을 가로지르는 선명한 시안 프레임, 그리고 차콜 콘텐츠 영역과 흰색 푸터 사이의 명도 대비다. 상단은 사진과 여백을 중심으로 구성하고, 하단은 촘촘한 격자로 정보를 정리한다. 계산기에는 이 대비를 짙은 헤더와 결과 패널, 밝은 입력 영역에 적용한다.

## Colors

| 색상 | 이미지에서 보이는 역할 | 계산기에서의 적용 |
| --- | --- | --- |
| 시안 `#079BE5` | 제목을 감싸는 프레임, 작은 아이콘과 강조선 | 헤더 프레임, 차콜 패널의 결과 강조, 어두운 배경의 포커스 |
| 잉크·네이비·블루 `#020106` · `#26385E` · `#346287` | 건물의 그림자와 유리 반사 | 헤더 배경의 명도와 색조 |
| 차콜 `#1C1C1C` | 사진 아래 정보 영역과 카드 사이의 바탕 | 결과 패널과 어두운 영역 |
| 흰색 · 밝은 회색 `#FFFFFF` · `#F8F8F8` | 푸터와 바깥 여백 | 입력 카드, 안내 팝업, 페이지 바탕 |

시안·건물 색조·차콜·밝은 바탕은 첨부 이미지에서 추출한 대표 샘플이다. `primary-deep`, 입력 테두리, 보조 텍스트, 오류 색 등은 앱에서 사용할 제안값이다. 밝은 배경의 링크·포커스와 흰 글자를 올리는 주 버튼에는 딥 블루 `#00618C`를 사용한다. 일반 텍스트 대비는 4.5:1 이상, 큰 텍스트와 의미 있는 컨트롤 경계는 3:1 이상으로 맞춘다.

## Typography

- 참고 이미지의 제목은 가늘고 폭이 좁은 산세리프체로 왼쪽 정렬되어 있다. 영어 메뉴는 작고 간격이 조밀하다. 정확한 서체명은 이미지로 확인하기 어려워, 앱에는 운영체제의 한글 산세리프 계열을 제안한다.
- 계산기 제목은 데스크톱 48px, 모바일 32px을 기준으로 한다. 본문은 16px, 입력 라벨은 14px 이상으로 유지한다.
- 예상 지급액은 36px을 기준으로 강조한다. 항목별 금액은 오른쪽 정렬하고 고정 폭 숫자를 적용해 자릿수를 쉽게 비교할 수 있게 한다.

## Layout

참고 이미지는 화면 폭을 채우는 사진 아래에 차콜 정보 영역을 두고, 세 개의 흑백 사진 카드를 같은 높이와 간격으로 배열한다. 시안 프레임은 사진과 어두운 영역의 경계를 가로지르고, 왼쪽 아래의 제목과 오른쪽의 짧은 설명이 비대칭을 이룬다.

- 헤더는 전체 폭을 쓰고, 내부 제목과 사용설명서 버튼은 본문 그리드에 맞춘다. 제목을 왼쪽에, 설명서 버튼과 시행본 정보를 오른쪽에 둔다.
- 데스크톱 본문은 최대 1,120px 너비를 기준으로 입력 영역과 결과 영역을 약 7:4로 배치한다. 열 간격은 24px, 양쪽 바깥 여백은 최소 32px을 기준으로 한다.
- 760px 이하에서는 좌우 여백을 16px로 줄이고 입력, 계산 버튼, 결과, 근거 순으로 쌓는다. 가로 320px에서도 날짜와 금액이 잘리지 않게 한다.
- 차콜 결과 영역에는 예상 지급액, 항목별 내역, 산정 근거 순으로 시선을 유도한다. 첨부 이미지의 3열 카드 리듬은 항목 간 반복 간격과 정렬에 활용한다.

## Elevation & Depth

명도 차이와 얇은 경계선으로 영역을 구분한다. 헤더에 이미지를 도입한다면 로컬 이미지의 대각선이 제목 뒤쪽으로 흐르게 하고, 짙은 오버레이로 글자 대비를 확보한다. 설명서 팝업은 어두운 배경막과 밝은 면으로 본문 위에 있는 상태를 나타낸다.

## Shapes

시안 프레임과 결과 패널은 직각을 중심으로 구성한다. 제안값은 헤더 강조선 3px, 입력 및 버튼 모서리 4px, 사용설명서 팝업 모서리 8px이다. 원형은 아이콘을 감싸는 작은 컨트롤에 한정한다.

## Motion & Micro-interaction

호버와 누름 상태의 색상 변화는 120ms 이내를 기준으로 한다. 팝업은 열자마자 닫기 버튼에 포커스를 두고, `Esc`나 닫기 버튼으로 닫으면 열기 버튼으로 포커스를 돌려준다. 움직임 감소 설정에서는 전환을 생략한다.

## Voice & Content Strategy

버튼은 `여비 계산하기`, `사용설명서 보기`처럼 완료할 동작을 밝힌다. 필드 이름은 `출장일`, `복귀일`, `여비 지급 구분`으로 통일한다. 결과 합계에는 `예상 지급액`을 쓰고 금액은 `250,000원`처럼 표시한다. 입력 오류는 조정할 항목과 방법을 함께 안내한다.

## Components

| 구성 요소 | 적용 지침 |
| --- | --- |
| 헤더 | 짙은 블루 면에 흰 제목을 두고 제목 영역에 시안 프레임을 적용한다. 작은 화면에서는 제목 아래에 설명서 버튼과 시행본 정보를 배치한다. |
| 날짜·조건 입력 | 흰 바탕에 라벨을 입력 위로 올린다. 입력과 주요 버튼에는 44px 이상의 높이, 오류에는 색과 안내 문구를 함께 사용한다. |
| 여비 계산 버튼 | 딥 블루 면과 흰 텍스트를 사용한다. 초기화는 외곽선 버튼으로 표현한다. |
| 결과 패널 | 차콜 바탕과 시안 강조선으로 구분하고, 흰색 또는 밝은 시안으로 합계를 표시한다. 빈 결과 영역에는 계산에 필요한 다음 행동을 안내한다. |
| 사용설명서 팝업 | 밝은 면과 짙은 제목을 사용한다. 작은 화면에서 설명 본문을 스크롤하는 동안 제목과 닫기 버튼이 계속 보이게 한다. |
| 계산 근거 | 흰 면과 얇은 구분선을 사용한다. PDF 링크는 딥 블루와 밑줄로 구별한다. |

## Do's and Don'ts

- 헤더 프레임, 결과 강조, 포커스에 시안을 반복해 화면 전체의 연결감을 만든다.
- 건축 사진을 사용한다면 오프라인 환경에서 로드되는 프로젝트 로컬 파일을 선택한다. 장식보다 날짜 입력과 계산 버튼의 시각적 우선순위를 높인다.
- 첨부 이미지 속 로고, 메뉴 문구, 브라우저 외곽과 떠 있는 이미지 뷰어 아이콘은 스타일 적용 범위에서 제외한다.

[DESIGN.md 공개 형식 명세](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md)
