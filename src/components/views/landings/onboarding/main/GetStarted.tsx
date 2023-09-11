import styled from 'styled-components';
import { OnboardingHeaderWrapper } from '@/components/views/landings/onboarding/common/common.styled';
import Input from '@/components/styled-components/Input';

const GetStarted = () => {
	return (
		<OnboardingHeaderWrapperStyled>
			{/*<H5 weight={700}>Get started with our Giveth onboarding guide</H5>*/}
			{/*<InputStyled placeholder='Your email address' />*/}
			{/*<Button size='small' label='Discover the Future of Giving' />*/}
			<div
				id='646b4736a2882bf86587185d'
				style={{ width: '100%', height: '100%' }}
			>
				<div
					id='646b4736a2882bf86587185d-form'
					className='646b4736a2882bf86587185d-template'
					style={{
						position: 'relative',
						display: 'flex',
						height: '100%',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div
						id='selected-_holfg9jol'
						className='ap3w-embeddable-form-646b4736a2882bf86587185d ap3w-embeddable-form-646b4736a2882bf86587185d-full ap3w-embeddable-form-646b4736a2882bf86587185d-solid'
						data-select='true'
					>
						<form
							id='ap3w-embeddable-form-646b4736a2882bf86587185d'
							className='ap3w-embeddable-form-content'
						>
							<div
								id='selected-_ne5h4af3o'
								className='ap3w-text ap3w-text-646b4736a2882bf86587185d ap3w-text--first '
							>
								<div data-select='true'>
									<p data-size='h1'>
										💌 Enter your email to get our free
										onboarding guide{' '}
									</p>
								</div>
							</div>
							<div
								id='selected-_18s7trjp5'
								className='ap3w-form-input ap3w-form-input-646b4736a2882bf86587185d'
								data-select='true'
								data-field-id='str::email'
								data-merge-strategy='override'
								style={{ width: '100%' }}
							>
								<label
									htmlFor='ap3w-form-input-email-646b4736a2882bf86587185d'
									className='ap3w-form-input-label'
								>
									Email address*
								</label>
								<input
									type='email'
									id='ap3w-form-input-email-646b4736a2882bf86587185d'
									step='1'
									name='email'
									required
								/>
							</div>
							<div
								id='selected-_45j87ga41'
								className='ap3w-form-button ap3w-form-button-646b4736a2882bf86587185d'
							>
								<button
									id='ap3w-form-button-646b4736a2882bf86587185d'
									type='submit'
									data-select='true'
									data-button-on-click='thank-you'
								>
									GET STARTED!
								</button>
							</div>
						</form>
					</div>
				</div>
				<div
					id='646b4736a2882bf86587185d-thank-you'
					className='646b4736a2882bf86587185d-template'
					style={{
						position: 'relative',
						display: 'none',
						height: '100%',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div
						id='selected-_qihyqwtgi'
						className='ap3w-embeddable-form-646b4736a2882bf86587185d ap3w-embeddable-form-646b4736a2882bf86587185d-full ap3w-embeddable-form-646b4736a2882bf86587185d-solid'
						data-select='true'
					>
						<form
							id='ap3w-embeddable-form-646b4736a2882bf86587185d'
							className='ap3w-embeddable-form-content'
						>
							<div
								id='selected-_zlfr6oqkd'
								className='ap3w-text ap3w-text-646b4736a2882bf86587185d ap3w-text--first ap3w-text--last'
							>
								<div data-select='true'>
									<p data-size='h2'>
										Your journey into the Future of Giving
										has just begun! Check your email for our
										special onboarding guide.{' '}
									</p>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</OnboardingHeaderWrapperStyled>
	);
};

const InputStyled = styled(Input)`
	max-width: 685px;
`;

const OnboardingHeaderWrapperStyled = styled(OnboardingHeaderWrapper)`
	margin: 64px auto 74px;
	> * {
		margin-bottom: 16px;
	}
`;

export default GetStarted;
